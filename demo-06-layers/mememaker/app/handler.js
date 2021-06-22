"use strict";

const { exec } = require("child_process");
const { promisify } = require("util");
const axios = require("axios");
const {
  promises: { writeFile, readFile, unlink },
} = require("fs");

const shell = promisify(exec);

const decoratorValidator = require("./util/decoratorValidator");
const globalEnum = require("./util/globalEnum");

const Joi = require("@hapi/joi");

class Handler {
  static validator() {
    return Joi.object({
      image: Joi.string().uri().required(),
      topText: Joi.string().max(200).required(),
      bottomText: Joi.string().max(200),
      size: Joi.number(),
    });
  }

  generateImagePath() {
    return `/tmp/${new Date().getTime()}-output.png`;
  }

  async saveImageLocally(imageURL, imagePath) {
    const { data } = await axios.get(imageURL, { responseType: "arraybuffer" });
    const buffer = Buffer.from(data, "base64");
    return writeFile(imagePath, buffer);
  }

  generateIdentifyCommand(imagePath) {
    const command = `gm identify -verbose ${imagePath}`;
    return command;
  }

  async getImageSize(imagePath) {
    const command = this.generateIdentifyCommand(imagePath);

    const { stdout } = await shell(command);
    const [line] = stdout
      .trim()
      .split("\n")
      .filter((text) => ~text.indexOf("Geometry"));

    const [width, height] = line.trim().replace("Geometry:", "").split("x");

    return {
      width: Number(width),
      height: Number(height),
    };
  }

  setParameters(options, dimensions, imagePath) {
    return {
      topText: options.topText,
      bottomText: options.bottomText || "",
      font: `${__dirname}/resources/fonts/impact.ttf`,
      fontSize: dimensions.width / 8,
      fontFill: "#fff",
      textPosition: "center",
      strokeColor: "#000",
      strokeWidth: 1,
      padding: 40,
      imagePath,
    };
  }

  setTextPosition(dimensions, padding, options) {
    const top = Math.abs(dimensions.height / options.size - padding) * -1;
    const bottom = Math.abs(dimensions.height / options.size - padding);
    return { top, bottom };
  }

  async generateConvertCommand(options, finalPath) {
    const value = `
      gm convert
      '${options.imagePath}'
      -font '${options.font}'
      -pointsize ${options.fontSize}
      -fill '${options.fontFill}'
      -stroke '${options.strokeColor}'
      -strokewidth ${options.strokeWidth}
      -draw 'gravity ${options.textPosition} text 0,${options.top}  "${options.topText}"'
      -draw 'gravity ${options.textPosition} text 0,${options.bottom}  "${options.bottomText}"'
      ${finalPath}
    `;
    const final = value.split("\n").join(" ");
    const { stdout } = await shell(final);
    return stdout;
  }

  async generateBase64(imagePath) {
    return readFile(imagePath, "base64");
  }

  async main(event) {
    try {
      const options = {
        ...event.queryStringParameters,
        size: event.queryStringParameters.size
          ? Number(event.queryStringParameters.size)
          : 2.1,
      };

      console.log("downloading image");

      const imagePath = this.generateImagePath();
      await this.saveImageLocally(options.image, imagePath);

      console.log("getting image size");
      const dimensions = await this.getImageSize(imagePath);

      const params = this.setParameters(options, dimensions, imagePath);
      const { top, bottom } = this.setTextPosition(
        dimensions,
        params.padding,
        options
      );

      const finalPath = this.generateImagePath();

      console.log("generating meme image");

      await this.generateConvertCommand(
        {
          ...params,
          top,
          bottom,
        },
        finalPath
      );

      console.log("generating base64...");

      const imageBuffer = await this.generateBase64(finalPath);

      console.log("finishing...");

      await Promise.all([unlink(imagePath), unlink(finalPath)]);

      return {
        statusCode: 200,
        body: `<img src="data:image/jpeg;base64,${imageBuffer}" />`,
        headers: {
          "Content-Type": "text/html",
        },
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

const handler = new Handler();

module.exports = {
  mememaker: decoratorValidator(
    handler.main.bind(handler),
    Handler.validator(),
    globalEnum.ARG_TYPE.QUERYSTRING
  ),
};
