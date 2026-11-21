// Fitur tools/cjstoesm — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/cjstoesm", {
  "name": "cjstoesm",
  "command": [
    "cjstoesm",
    "cjs2esm",
    "cjsconvert"
  ],
  "category": "tools",
  "desc": "Convert CommonJS ke ESM (ES Modules)",
  "usage": ".cjstoesm <reply kode>",
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
