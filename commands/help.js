const { commands, config } = global.Webbot;

export class Command {
  settings = {
    name: "help",
    version: "1.1.0", 
    category: "system", 
    cooldown: "10", 
    permission: "0", 
    creator: "MrkimstersDEV x Liane Cagara", 
    description: "Shows all commands or detailed info about a specific command",
    noPrefix: true,
  };

  async main({ send, event, args }) {
    const commandsPerPage = 10; // Number of commands to display per page
    const validCommands = Object.values(commands);
    const totalCommands = validCommands.length;
    const totalPages = Math.ceil(totalCommands / commandsPerPage);

    // Check if the user wants to list all commands grouped by category
    if (args[0] === "all") {
      const categorizedCommands = {};

      for (const command of validCommands) {
        const category = command.settings.category || "Uncategorized";
        if (!categorizedCommands[category]) {
          categorizedCommands[category] = [];
        }
        categorizedCommands[category].push(command.settings.name);
      }

      let result = "✨ All Commands\n\n";

      for (const [category, commandsList] of Object.entries(categorizedCommands)) {
        result += `『 ${category} 』\n${commandsList.join(", ")}\n\n`;
      }

      return send(result.trim());
    }

    if (args[0] && isNaN(parseInt(args[0], 10))) {
      // User is asking for a specific command's details
      const commandName = args[0];
      const command = validCommands.find(cmd => cmd.settings.name === commandName);
      
      if (!command) {
        return send("Command not found.");
      }

      const { settings } = command;
      const description = settings.description || "No description available.";

      return send(
        `『 ${settings.name} 』\n${description}\n\n` +
        `   •  Version: ${settings.version || "1.0"}\n` +
        `   •  Category: ${settings.category || "General"}\n` +
        `   •  Cooldown: ${settings.cooldown || 0}\n` +
        `   •  Permission: ${settings.permission || 0} (All users)\n` +
        `   •  Creator: ${settings.creator || "Unknown"}`
      );
    }

    let page = parseInt(args[0], 10) || 1;
    if (page < 1) page = 1;

    // Check if the requested page is available
    if (page > totalPages) {
      return send(`Page ${page} is not available. There are only ${totalPages} pages.`);
    }

    let result = `✨ Commands List\n\n`;
    let index = (page - 1) * commandsPerPage + 1;
    const commandsList = validCommands.slice((page - 1) * commandsPerPage, page * commandsPerPage);

    for (const command of commandsList) {
      const { settings } = command;
      const description = settings.description || "No description available.";
      result += `『 ${index++} 』 ${settings.name}: ${description}\n`;
    }
    result += `\n» Page: ${page}/${totalPages}\n» Use ${config.PREFIX}help [page number] to display the information on the additional pages.`;

    send(result);
  }
}