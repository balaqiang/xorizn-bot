// Fitur ephoto/glowingtext — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ephoto/glowingtext", {
  "name": "glowingtext",
  "command": [
    "glowingtext"
  ],
  "category": "image",
  "desc": "Fitur glowingtext <teks>",
  "usage": ".glowingtext <teks>",
  "limit": true
})
