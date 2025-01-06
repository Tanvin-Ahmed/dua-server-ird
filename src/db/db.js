const sqlite3 = require("sqlite3").verbose();

module.exports.db = new sqlite3.Database("dua_main.sqlite", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the database.");
});
