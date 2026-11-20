// Fitur canvas/pacarsertifikat — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("canvas/pacarsertifikat", {
  "name": "pacarsertifikat",
  "command": [
    "pacarsertifikat",
    "sertifikatpacar",
    "certpacar",
    "pacarcert"
  ],
  "category": "image",
  "desc": "Membuat sertifikat pacar",
  "usage": ".pacarsertifikat <nama1> <nama2>",
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
