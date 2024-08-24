import express from "express";
import fs from "fs";
import path from "path";
import gradient from "gradient-string";
import { resolve } from "dns";
const pkg = require("./package.json");

class Webbot {
  static config = require("./config.json");
  static async main(args) {
    const { logger } = this;
    logger(`Starting **WEB BOT SYSTEM** v${pkg.version}`, "info");
    logger(`Author: **${pkg.author}**`, "info");

    logger(`**| ----- Loading all commands ---- |**`.toUpperCase(), "commands");
    console.log("\n");
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

    app.get("/", (req, res) => {
      res.send("Test...");
    });

    app.get("/api/event", (req, res) => {
      return new Promise((resolve, reject) => {
        const event = { ...req.query };
        Webbot.handlerEvents({
          resolve,
          reject,
          event,
          timestamp: Date.now(),
        });
      });
    });

    app.listen(3000, () => {
      logger("Server started on port **3000**", ":D", "express");
    });
  }
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

  static commands = {};
  static cmdPath = "commands";
  static pkg = pkg;
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
  static async handlerEvents({ resolve, reject, timestamp, event = {} }) {
    const sendInst = new this.Send({ resolve, reject, timestamp });
    const send = sendInst.send.bind(sendInst);
    try {
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

      let [commandName, ...args] = event.body.split(" ");
      let hasPrefix = commandName.startsWith(config.PREFIX);
      if (hasPrefix) {
        commandName = commandName.slice(config.PREFIX.length);
      }
      const match = Object.keys(commands).find(
        (key) =>
          String(key).toLowerCase().replaceAll(" ", "") ===
          commandName.toLowerCase(),
      );
      const command = commands[match];
      if (!command) {
        return send(`❌ Command "${commandName}" not found.`);
      }
      const { settings, main } = command;
      if (settings.noPrefix !== true && !hasPrefix) {
        return;
      }
      await main({ send, event, args, resolve, reject, Webbot });
    } catch (error) {
      return send(error.stack);
    }
  }
  Send = class Send {
    constructor({ resolve, reject, timestamp = Date.now() }) {
      Object.assign(this, { resolve, reject, timestamp });
    }
    async send(message, { ...extras } = {}) {
      const timestamp = Date.now();
      this.resolve({
        originalTimestamp: this.timestamp,
        timestamp,
        ping: timestamp - this.timestamp,
        message,
        ...extras,
      });
    }
  };
}
global.Webbot = Webbot;

const app = express();

Webbot.main(process.argv);
