// Fitur maker/sertifikatnasa — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("maker/sertifikatnasa", {
  "name": "sertifikatnasa",
  "command": [
    "sertifikatnasa",
    "nasacert",
    "sertifnasa",
    "sertifikat-nasa"
  ],
  "category": "maker",
  "desc": "Generate gambar Sertifikat NASA dengan nama custom",
  "usage": ".sertifikatnasa <nama>",
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
