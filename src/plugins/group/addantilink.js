// Fitur group/addantilink — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/addantilink", {
  "name": "addantilink",
  "command": [
    "addantilink",
    "addalink",
    "addblocklink"
  ],
  "category": "group",
  "desc": "Menambah link ke daftar antilink",
  "usage": ".addantilink <domain/pattern>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
