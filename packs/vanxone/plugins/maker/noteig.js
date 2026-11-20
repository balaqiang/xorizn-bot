// Fitur maker/noteig — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("maker/noteig", {
  "name": "noteig",
  "command": [
    "noteig",
    "noteinstagram",
    "ignote",
    "catatanig",
    "catataninstagram"
  ],
  "category": "maker",
  "desc": "Bikin Instagram Note dari foto profil/foto reply",
  "usage": ".noteig <nama>|<catatan>|<waktu>",
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
