export class Command {
  settings = {
    name: "uptime",
    description: "Displays the bot's uptime",
  };

  async main({ send }) {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    send(`Bot has been up for: ${hours}h ${minutes}m ${seconds}s`);
  }
}
