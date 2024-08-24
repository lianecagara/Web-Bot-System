import express from "express";
import fs from "fs";
import path from "path";
import gradient from "gradient-string";

class Webbot {
  static async main(args) {
    const { logger } = this;
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
    process.stdout.write(`${retro(`[${String(title).toUpperCase()}] -`)} ${args.join(" ")}\n`);
  }
  static async loadAllCommands() {}
}
global.Webbot = Webbot;

const app = express();

Webbot.main(process.argv);
