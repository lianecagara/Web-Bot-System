const axios = require("axios");
let status = true;

module.exports = {
  config: {
    name: "autoweb",
    version: "1.0",
    author: "LiANE @nealianacagara",
    role: 0,
    category: "Ai-Chat",
    shortDescription: {
      en: "",
    },
    longDescription: {
      en: "",
    },
    guide: {
      en: "{pn} [query]",
    },
  },
  onStart({ message }) {
    // this is intentionally left empty 🙂
  },
  async onChat({ message, event, api }) {
    const timeA = Date.now();
    if (!status) return;
    try {
      //event.strictPrefix = true;
      if (
        event.type === "message_reply" &&
        api.getCurrentUserID() === event.messageReply.senderID
      ) {
        return;
      }
      const response = await axios.get(
        "url here",
        { params: event },
      );
      const { message: body, fail } = response.data;
      if (fail) {
        return;
      }
      const timeB = Date.now();
      message.reply(`${body}\n\nPing: ${timeB - timeA}ms`);
    } catch (error) {
    }
  },
};
