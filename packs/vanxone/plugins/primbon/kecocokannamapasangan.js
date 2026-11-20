// Fitur primbon/kecocokannamapasangan — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("primbon/kecocokannamapasangan", {
  "name": "kecocokannamapasangan",
  "command": [
    "kecocokannamapasangan",
    "cocoknama",
    "matchname"
  ],
  "category": "primbon",
  "desc": "Cek kecocokan nama pasangan",
  "usage": ".kecocokannamapasangan <nama1> <nama2>",
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
