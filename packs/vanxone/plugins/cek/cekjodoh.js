// Fitur cek/cekjodoh — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekjodoh", {
  "name": "cekjodoh",
  "command": [
    "cekjodoh",
    "match"
  ],
  "category": "cek",
  "desc": "Cek kecocokan jodoh",
  "usage": ".cekjodoh <nama1> & <nama2>",
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
