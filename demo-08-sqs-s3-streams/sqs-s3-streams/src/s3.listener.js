const AWS = require("aws-sdk");
const { Writable, pipeline } = require("stream");
const csvtojson = require("csvtojson");

class Handler {
  constructor({ s3Service, sqsService }) {
    this.s3Service = s3Service;
    this.sqsService = sqsService;
    this.queueName = process.env.SQS_QUEUE;
  }

  static getSdks() {
    const host = process.env.LOCALSTACK_HOST | "localhost";
    const s3Port = process.env.S3_PORT | "4566";
    const sqsPort = process.env.SQS_PORT | "4566";
    const isLocal = process.env.IS_LOCAL;

    if (!isLocal) {
      return {
        s3: new AWS.S3({
          s3ForcePathStyle: true,
        }),
        sqs: new AWS.SQS(),
      };
    }

    const s3Endpoint = new AWS.Endpoint(`http://${host}:${s3Port}`);
    const sqsEndpoint = new AWS.Endpoint(`http://${host}:${sqsPort}`);

    return {
      s3: new AWS.S3({
        endpoint: s3Endpoint,
        s3ForcePathStyle: true,
      }),
      sqs: new AWS.SQS({
        endpoint: sqsEndpoint,
      }),
    };
  }

  async getQueueUrl() {
    const { QueueUrl } = await this.sqsService
      .getQueueUrl({
        QueueName: this.queueName,
      })
      .promise();

    return QueueUrl;
  }

  processDataOnDemand(queueUrl) {
    const writableStream = new Writable({
      write: (chunk, enconding, done) => {
        const item = chunk.toString();
        console.log("sending...", item, "at", new Date().toISOString());

        this.sqsService.sendMessage(
          {
            QueueUrl: queueUrl,
            MessageBody: item,
          },
          done
        );
      },
    });

    return writableStream;
  }

  async pipefyStreams(...args) {
    return new Promise((resolve, reject) => {
      pipeline(...args, (error) => (error ? reject(error) : resolve()));
    });
  }

  async main(event) {
    try {
      const [
        {
          s3: {
            bucket: { name },
            object: { key },
          },
        },
      ] = event.Records;
      console.log("processing...", name, key);

      console.log("getting queue url");
      const queueUrl = await this.getQueueUrl();

      await this.pipefyStreams(
        this.s3Service
          .getObject({
            Bucket: name,
            Key: key,
          })
          .createReadStream(),
        csvtojson(),
        this.processDataOnDemand(queueUrl)
      );

      console.log("process finished...", new Date().toISOString());

      return {
        statusCode: 200,
        body: "Process finished with success",
      };
    } catch (error) {
      console.error("Error:::", error);
      return {
        statusCode: 500,
        body: "Internal server error",
      };
    }
  }
}

const { s3, sqs } = Handler.getSdks();

const handler = new Handler({
  s3Service: s3,
  sqsService: sqs,
});

module.exports = handler.main.bind(handler);
