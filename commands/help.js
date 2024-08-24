const { commands, config } = global.Webbot;

export class Command {
  settings = {
    name: "help",
    description: "Shows all commands",
    noPrefix: true,
  };

  main({ send, event, args }) {
    if (args[0]) {
      const command = commands[args[0]];
      if (!command) {
        return send("Command not found");
      }
      const { settings } = command;
      return send(
        `Command: ${settings.name}\nDescription: ${settings.description}`,
      );
    }
    let result = `✨ Available Commands\n\n`;
    for (const name in commands) {
      const { settings } = commands[name];
      result += `➡️ ${config.PREFIX}${settings.name} - ${settings.description}\n`;
    }
    result += `\n💡 Use ${config.PREFIX}help <command> to get more info about a command.`;
    send(result);
  }
}
