import { LianeAPI } from "fca-liane-utils";

export class Command {
  settings = {
    name: "ai",
    description: "Ask AI",
    noPrefix: true,
  };

  async main({ send, event, args }) {
    if (args[0]) {
      const ai = new LianeAPI("axis", "LianeAPI_Reworks");
      const response = await ai.ask(args.join(" "));
      return send(response);
    }
    return send("Please provide a message.");
  }
}