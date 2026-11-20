// Fitur ephoto/flagtext — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ephoto/flagtext", {
  "name": "flagtext",
  "command": [
    "flagtext"
  ],
  "category": "image",
  "desc": "Fitur flagtext <teks>",
  "usage": ".flagtext <teks>",
  "limit": true
})
