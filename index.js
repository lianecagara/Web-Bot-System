const { spawn } = require("child_process");

function start() {
  const child = spawn("node", ["spawner.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true,
    env: { ...process.env, FORCE_COLOR: true },
  });
  child.on("close", (code) => {
    if (code === 2) {
      start();
    }
  });
}