// Fitur religi/autosahur — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("religi/autosahur", {
  "name": "autosahur",
  "command": [
    "autosahur",
    "sahur"
  ],
  "category": "islam",
  "desc": "Pengingat sahur otomatis (Setiap jam 03:00)",
  "usage": ".autosahur on/off",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
