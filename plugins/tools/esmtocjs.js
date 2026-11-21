// Fitur tools/esmtocjs — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/esmtocjs", {
  "name": "esmtocjs",
  "command": [
    "esmtocjs",
    "esm2cjs",
    "esmconvert"
  ],
  "category": "tools",
  "desc": "Convert ESM (ES Modules) ke CommonJS",
  "usage": ".esmtocjs <reply kode>",
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
