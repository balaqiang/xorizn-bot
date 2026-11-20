// Fitur tools/facedetector — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/facedetector", {
  "name": "facedetector",
  "command": [
    "facedetector",
    "facedetect",
    "detectface",
    "deteksiwajah"
  ],
  "category": "tools",
  "desc": "Mendeteksi wajah pada gambar",
  "usage": ".facedetector (reply gambar)",
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
