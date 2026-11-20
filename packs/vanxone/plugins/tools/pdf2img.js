// Fitur tools/pdf2img — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("tools/pdf2img", {
  "name": "pdf2img",
  "command": [
    "pdf2img",
    "pdf2image"
  ],
  "category": "tools",
  "desc": "Convert halaman PDF jadi gambar",
  "usage": ".pdf2img (reply PDF) [range halaman, cth 1-5]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 15,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
