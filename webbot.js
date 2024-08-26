// This source code is written by Liane Cagara.

import express from "express";
import fs from "fs";
import path from "path";

// for Retro Theme
import gradient from "gradient-string";

// for accessing package.json as an object and without using some fs
const pkg = require("./package.json");

// mongodb abstraction API
import LiaMongo from "lia-mongo";

// This is a Webbot class that is responsible for everything, (do not make an instance), also accessible through global.Webbot
class Webbot {
  // attach the config as a property so ez access
  static config = require("./config.json");

  // declare without being initialized, because it will be used later.
  static liaMongo;

  // the main method.
  static async main(args) {
    const { logger } = this; // 'this' refers to static methods lmao not instance methods

    logger(`Starting **WEB BOT SYSTEM** v${pkg.version}`, "info");
    logger(`Author: **${pkg.author}**`, "info");
    logger(`Connecting to DATABASE...`, "DB");

    // make instance of lia-mongo then assign it later in the liaMongo static field.
    const liaMongo = new LiaMongo({
      uri: process.env.MONGO_URI,
      collection: "webbotdb",
    });
    this.liaMongo = liaMongo;
    try {
      await liaMongo.start();
      await liaMongo.put("4", {});
      logger("Connected to DATABASE", "DB");
    } catch (error) {
      logger(error, "DB");
    }

    logger(`**| ----- Loading all commands ---- |**`.toUpperCase(), "commands");
    console.log("\n");

    // this method is for loading all commands, it has callback whenever something is loaded, it is also assigned to this.commands automatically, callback first argument is the error, and the second argument is the name of file and the loaded command.
    await this.loadAllCommands((error, { file, data }) => {
      if (error) {
        return logger("**FAIL!!**", error, file);
      }
      logger(`Loaded from **${file}**.`, data.settings.name);
    });
    console.log("\n");
    logger(
      `Loaded all **${Object.keys(this.commands).length}** commands.`,
      "commands",
    );

    // public folder now serves as a static folder and it can be accessed by the client, and it's PUBLIC! anyone is able to see the files in this folder.
    app.use(express.static(path.join(__dirname, "public")));

    // path responsible for sending event data to the bot, and it will respond a json. (bot response )
    app.get("/api/event", async (req, res) => {
      const result = await new Promise((resolve, reject) => {
        const event = { ...req.query };
        Webbot.handlerEvents({
          resolve,
          reject,
          event,
          timestamp: Date.now(),
        });
      });
      res.json(result);
    });

    // start the server in port 3000 (sorry for not making it as variable)
    app.listen(3000, () => {
      logger("Server started on port **3000**", ":D", "express");
    });
  }

  // the awesome weird but cool logger, last argument is the title
  static logger(...args) {
    const title = args.length === 1 ? "info" : args.pop();
    const { retro } = gradient;
    process.stdout.write(
      `${retro(`[${String(title).toUpperCase()}] -`)} ${args.join(" ")}\n`.replace(
        /\*\*(.*?)\*\*/g,
        (match, p1) => {
          return gradient.pastel(p1);
        },
      ),
    );
  }

  // storage for commands (memory)
  static commands = {};
  // aliases
  static aliases = {};
  static cmdPath = "commands";
  static pkg = pkg;

  // unused lmao
  static queue = [];

  static async loadAllCommands(callback = async function () {}) {
    const allFiles = fs
      .readdirSync(this.cmdPath)
      .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));
    const results = [];
    for (const file of allFiles) {
      try {
        const data = await this.loadCommand(file);
        results.push(data);
        await callback(null, data);
      } catch (error) {
        const data = {
          file,
          error,
          data: null,
          original: null,
        };
        results.push(data);
        await callback(error, data);
      }
    }
    return results;
  }

  // individual command loader :)
  static async loadCommand(file) {
    const { Command } = require(path.join(__dirname, this.cmdPath, file));
    const command = new Command();
    const { settings, main } = command;
    if (!settings.name) {
      throw new Error("Command name is not defined");
    }
    if (!settings.description) {
      throw new Error("Command description is not defined");
    }
    if (typeof main !== "function") {
      throw new Error("Command main must be a function");
    }
    this.commands[settings.name] = command;
    return {
      file,
      error: null,
      data: command,
      original: Command,
    };
  }
  // handles the bot and utilizes the commands loaded.
  static async handlerEvents({ resolve, reject, timestamp, event = {} }) {
    const sendInst = new Webbot.Send({ resolve, reject, timestamp });
    const send = sendInst.send.bind(sendInst);
    try {
      // just making sure it's type safe in case its missing, like defaults stuffs
      event.body ??= "";
      event.senderID ??= "4";
      event.threadID ??= event.senderID;
      event.messageID ??= `mid.${Date.now()}`;
      event.type ??= "message";
      event.mentions ??= {};
      event.attachments ??= [];
      event.isGroup ??= false;
      event.timestamp ??= timestamp;
      const { config, commands } = this;

      // using array destructing, we can get the command name and extra args
      let [commandName = "", ...args] = event.body.split(" ");
      console.log(event);

      // common sense, this is true if the command starts with a prefix
      let hasPrefix = commandName.startsWith(config.PREFIX);

      // remove the prefix if it has prefix
      if (hasPrefix) {
        commandName = commandName.slice(config.PREFIX.length);
      }
      // when someone types 'prefix' it will show
      if (commandName.toLowerCase() === "prefix" && !hasPrefix) {
        return send(`✨ My Prefix is [ ${config.PREFIX} ]`);
      }

      // CASE-SENSITIVE matching, regardless if the command name or the input has different cases. also ignoring spaces but who the fuck will add spaces to the command name?
      const match = Object.keys(commands).find(
        (key) =>
          String(key).toLowerCase().replaceAll(" ", "") ===
          commandName.toLowerCase(),
      );

      // get the command data
      const command = commands[match];
      if (!command) {
        // if the command is missing and it has prefix, notify that it doesn't exist.
        if (hasPrefix) {
          return send(
            `❌ Command ${commandName ? `"${commandName}"` : "you are using"} does not exist. Type "${config.PREFIX}help" to view available commands.`,
          );
        }
        // sends a fail flag and better to be hidden or disregarded.
        return send("FAIL", {
          fail: true,
        });
      }

      this.logger("CALL COMMAND", commandName);
      // get the command settings and the main method.
      const { settings, main } = command;
      if (settings.noPrefix !== true && !hasPrefix) {
        // ignore if the command does not accept noprefix inputs and the input has no prefix to avoid clutter
        return;
      }
      // finally, execute the main function of the command, self explanatory
      await main({
        send,
        event,
        args,
        resolve,
        reject,
        Webbot,
        liaMongo: this.liaMongo,
      });
    } catch (error) {
      // notify about the error
      return send(error.stack);
    }
  }
  // kinda useless but let it be
  static Send = class Send {
    done = false;
    constructor({ resolve, reject, timestamp = Date.now() }) {
      this.done = false;
      Object.assign(this, { resolve, reject, timestamp });
    }
    // this is the function used for bot to respond once, yes! Once.
    async send(message, { ...extras } = {}) {
      if (this.done === true) {
        // i wanna avoid confusion or error so I'll throw immediately
        throw new Error(
          `Cannot use the 'send' function twice, please check your script`,
        );
      }
      const timestamp = Date.now();
      const result = {
        originalTimestamp: this.timestamp,
        timestamp,
        ping: timestamp - this.timestamp,
        message,
        ...extras,
      };
      this.resolve(result);
      console.log("Sent response, ", result);
      this.done = true;
    }
  };
}
// make it available anywhere
global.Webbot = Webbot;

const app = express();

// execute it ofc
Webbot.main(process.argv);
