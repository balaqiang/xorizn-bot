// Fitur canvas/fakesertifikat — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("canvas/fakesertifikat", {
  "name": "fakesertifikat",
  "command": [
    "fakesertifikat",
    "sertifikatfake",
    "fakecert"
  ],
  "category": "image",
  "desc": "Bikin fake sertifikat penghargaan (buat konten/gaguan doang)",
  "usage": ".fakesertifikat <nama> | <penghargaan>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 8,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
