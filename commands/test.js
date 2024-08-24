// This is a command template bozo

export class Command {
  settings = {
    // The name of the command
    name: "test",
    // The description of the command
    description: "Test command",
  };

  // The main function of the command should be here
  main({ send, event }) {
    send("Hello, World!");
  }
}
