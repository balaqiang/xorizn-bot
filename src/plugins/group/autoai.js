// Fitur group/autoai — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/autoai", {
  "name": "autoai",
  "command": [
    "autoai",
    "aai"
  ],
  "category": "group",
  "desc": "Toggle auto AI response untuk grup dengan pilihan text atau voice",
  "usage": ".autoai on/off --xoriznmode=<character|custom> --logic=<custom instruction> --type=<text|voice> --mode=<onlychat|assistant>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [
      "firefly"
    ],
    "scrapers": [],
    "assets": []
  }
})
