const { spawn } = require("child_process");

const backend = spawn(process.execPath, ["server.js"], {
  stdio: "inherit",
  env: { ...process.env },
});

const reactScriptsBin = require.resolve("react-scripts/bin/react-scripts.js");
const frontend = spawn(process.execPath, [reactScriptsBin, "start"], {
  stdio: "inherit",
  env: { ...process.env },
});

const shutdown = (code = 0) => {
  if (!backend.killed) backend.kill();
  if (!frontend.killed) frontend.kill();
  process.exit(code);
};

backend.on("exit", (code) => {
  if (code !== null && code !== 0) shutdown(code);
});

frontend.on("exit", (code) => {
  shutdown(code || 0);
});

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
