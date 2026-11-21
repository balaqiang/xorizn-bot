// Fitur tools/o-sendngl — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/sendngl", {
  "name": "sendngl",
  "command": [
    "sendngl"
  ],
  "category": "tools",
  "desc": "Send NGL",
  "usage": ".sendngl <url> | <text>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
