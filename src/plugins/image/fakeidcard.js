// Fitur canvas/fakeidcard — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("canvas/fakeidcard", {
  "name": "fakeidcard",
  "command": [
    "fakeidcard",
    "idcardfake",
    "faketanda",
    "faketandapengenal"
  ],
  "category": "image",
  "desc": "Bikin fake ID Card (buat konten/gaguan doang)",
  "usage": ".fakeidcard <nama> | <jabatan>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
