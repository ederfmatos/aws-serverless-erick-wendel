const { SES, S3 } = require("aws-sdk");

const mailComposer = require("mailcomposer");
const { promisify } = require("util");

const {
  promises: { writeFile, unlink },
} = require("fs");

const emailService = new SES({
  region: "us-east-1",
});

const s3Service = new S3();

const handler = async (event) => {
  console.log(
    "Received event::",
    JSON.stringify(event, null, 2),
    new Date().toISOString()
  );

  const [
    {
      s3: {
        bucket: { name },
        object: { key },
      },
    },
  ] = event.Records;
  const params = { Bucket: name, Key: key };

  console.log("using with bucket data:::", JSON.stringify(params));

  console.log("downloading file...");

  const { Body: file } = await s3Service.getObject(params).promise();

  console.log("saving file");

  const pathName = `/tmp/${new Date().getTime()}-${key.replace("/", "")}`;

  await writeFile(pathName, file);

  const data = {
    to: process.env.SES_EMAIL_TO,
    from: process.env.SES_EMAIL_FROM,
    subject: "Report generated",
  };

  const mail = mailComposer({
    to: process.env.SES_EMAIL_TO,
    from: process.env.SES_EMAIL_FROM,
    subject: "Report generated",
    text: "Body message!!! Uhuuul",
    attachments: [
      {
        path: pathName,
      },
    ],
  });

  const message = await promisify(mail.build.bind(mail))();
  console.log("Sending mail...");

  const response = await emailService
    .sendRawEmail({
      RawMessage: { Data: message },
    })
    .promise();

  console.log("removing temporary file...");

  await unlink(pathName);

  console.log("finishing:::", JSON.stringify(response, null, 2));

  return {
    statusCode: 200,
    body: JSON.stringify(response, null, 2),
  };
};

module.exports = { handler };
