// Fitur canvas/juarabadminton — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("canvas/juarabadminton", {
  "name": "juarabadminton",
  "command": [
    "juarabadminton",
    "sertifikatbadminton",
    "badmintoncert",
    "badminton"
  ],
  "category": "image",
  "desc": "Membuat sertifikat Juara Badminton kustom",
  "usage": ".juarabadminton <nama>",
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
