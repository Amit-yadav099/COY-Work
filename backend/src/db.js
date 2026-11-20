const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const DATA_PATH = path.join(__dirname, "..", "data", "db.json");

function ensureDb() {
  if (!fs.existsSync(DATA_PATH)) {
    spawnSync("node", [path.join(__dirname, "seed.js")], { stdio: "inherit" });
  }
}

function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
}

function writeDb(db) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(db, null, 2));
}

module.exports = { readDb, writeDb, DATA_PATH };
