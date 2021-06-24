class Handler {
  async main(event) {
    try {
      const [{ body, messageId }] = event.Records;

      const item = JSON.parse(body);
      console.log("event...", {
        ...item,
        messageId,
        at: new Date().toISOString(),
      });
      return {
        statusCode: 200,
        body: `Hello`,
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

module.exports = handler.main.bind(handler);
