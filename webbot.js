import express from "express";
import fs from "fs";
import path from "path";
import gradient from "gradient-string";
const pkg = require("./package.json");

class Webbot {
  static async main(args) {
    const { logger } = this;
    logger(`Starting **WEB BOT SYSTEM** v${pkg.version}`, "info");
    logger(`Author: **${pkg.author}**`, "info");
    app.get("/", (req, res) => {
      res.send("Test...");
    });

    app.listen(3000, () => {
      logger("Server started on port 3000", ":D", "express");
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
  static pkg = pkg;
  static async loadAllCommands() {}
}
global.Webbot = Webbot;

const app = express();

Webbot.main(process.argv);
