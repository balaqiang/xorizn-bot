// Fitur stalker/discordstalk — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("stalker/discordstalk", {
  "name": "discordstalk",
  "command": [
    "discordstalk",
    "dcstalk",
    "dsstalk",
    "stalkdiscord",
    "stalkdc"
  ],
  "category": "stalker",
  "desc": "Stalk akun Discord berdasarkan User ID",
  "usage": ".discordstalk <userid>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
