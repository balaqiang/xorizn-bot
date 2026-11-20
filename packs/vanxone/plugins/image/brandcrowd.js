// Fitur ephoto/brandcrowd — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ephoto/brandcrowd", {
  "name": "brandcrowd",
  "command": [
    "brandcrowd",
    "bcrowd",
    "logomaker"
  ],
  "category": "image",
  "desc": "Fitur brandcrowd <nama brand>",
  "usage": ".brandcrowd <nama brand>",
  "limit": true
})
