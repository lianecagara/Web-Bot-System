const { spawn } = require("child_process");

function start() {
  const child = spawn("node", ["spawner.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true,
    env: process.env,
  });
  child.on("close", (code) => {
    if (code === 2) {
      start();
    }
  });
}

start();
