import express from "express";
import fs from "fs";
import path from "path";

class Webbot {
  static async main(args) {
    console.log(">", ...args);
    app.get("/", (req, res) => {
      res.send("Test...");
    });

    app.listen(3000, () => {
      console.log("Server started on port 3000");
    });
  }
  static async loadAllCommands() {}
}
global.Webbot = Webbot;

const app = express();

Webbot.main(process.argv);
