// Fitur search/objectgeometrydash — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("search/objectgeometrydash", {
  "name": "objectgeometrydash",
  "command": [
    "objectgeometrydash",
    "objgd",
    "objgdsearch",
    "searchobjgd"
  ],
  "category": "search",
  "desc": "Cari, list, & download PNG objek Geometry Dash dari wiki resmi (geometrydash.wiki.gg)",
  "usage": ".objgd <nama objek> | .objgd <nomor> | .objgd --list [halaman]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
