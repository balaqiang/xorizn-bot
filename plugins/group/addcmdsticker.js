// Fitur group/addcmdsticker — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("group/addcmdsticker", {
  "name": "addcmdsticker",
  "command": [
    "addcmdsticker",
    "addstickercmd",
    "setsticker",
    "stickeradd"
  ],
  "category": "group",
  "desc": "Jadikan sticker sebagai shortcut command",
  "usage": ".addcmdsticker <command> (reply sticker)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
