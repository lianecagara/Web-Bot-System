export class Command {
  settings = {
    name: "balance",
    description: "Check your balance",
  };

  async main({ send, event, args, liaMongo }) {
    if (event.senderID === "4") {
      return send(`❌ You must have a valid senderID.`);
    }
    const userData = await liaMongo.get(event.senderID);
    return send(`💰 You have ${userData.money ?? "no"} coins.`);
  }
}
