// Fitur group/listantilink — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/listantilink", {
  "name": "listantilink",
  "command": [
    "listantilink",
    "antilinklist",
    "cekantilink"
  ],
  "category": "group",
  "desc": "Melihat daftar link yang diblokir",
  "usage": ".listantilink",
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
