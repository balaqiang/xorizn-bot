// Fitur main/system — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("main/system", {
  "name": "system",
  "command": [
    "system",
    "ram",
    "cpu",
    "disk",
    "latency"
  ],
  "category": "info",
  "desc": "Menampilkan informasi sistem (RAM, CPU, Disk, Latency)",
  "usage": ".ram | .cpu | .disk | .ping",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
