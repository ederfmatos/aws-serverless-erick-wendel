"use strict";

const { get } = require("axios");

class Handler {
  constructor({ rekognitionService, translateService }) {
    this.rekognitionService = rekognitionService;
    this.translateService = translateService;
  }

  async detectImageLabels(buffer) {
    const result = await this.rekognitionService
      .detectLabels({
        Image: {
          Bytes: buffer,
        },
      })
      .promise();

    const workingItems = result.Labels.filter(
      ({ Confidence }) => Confidence > 80
    );

    const names = workingItems.map(({ Name }) => Name).join(" ");

    return { names, workingItems };
  }

  async getImageBuffer(imageUrl) {
    const response = await get(imageUrl, {
      responseType: "arraybuffer",
    });

    const buffer = Buffer.from(response.data, "base64");
    return buffer;
  }

  async translateText(text) {
    const params = {
      SourceLanguageCode: "en",
      TargetLanguageCode: "pt",
      Text: text,
    };

    const { TranslatedText } = await this.translateService
      .translateText(params)
      .promise();

    return TranslatedText.split(" ").filter(
      (textTranslated) => textTranslated !== "de"
    );
  }

  formatTextResults(texts, workingItems) {
    const finalText = texts.reduce((acc, text, index) => {
      const nameInPortuguese = text;
      const confidence = workingItems[index].Confidence;
      const phrase = `${confidence.toFixed(
        2
      )}% de ser do tipo ${nameInPortuguese}`;

      return [...acc, phrase];
    }, []);

    return finalText.join("\n");
  }

  async main(event) {
    try {
      const { imageUrl } = event.queryStringParameters;

      console.log("downloading image...");

      const imageBuffer = await this.getImageBuffer(imageUrl);

      console.log("Detecting labels...");
      const { names, workingItems } = await this.detectImageLabels(imageBuffer);

      console.log("Translating to Portuguese...");
      const texts = await this.translateText(names);

      console.log("handling final object...");

      const finalText = this.formatTextResults(texts, workingItems);
      console.log("finishing...");

      return {
        statusCode: 200,
        body: `A imagem tem `.concat(finalText),
      };
    } catch (error) {
      console.error("Error:::", error);
      return {
        statusCode: 500,
        body: "Internal Server Error!",
      };
    }
  }
}

const aws = require("aws-sdk");

const reko = new aws.Rekognition();
const translate = new aws.Translate();

const handler = new Handler({
  rekognitionService: reko,
  translateService: translate,
});

module.exports.main = handler.main.bind(handler);
