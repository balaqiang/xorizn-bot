// Fitur ephoto/glitchtext — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ephoto/glitchtext", {
  "name": "glitchtext",
  "command": [
    "glitchtext"
  ],
  "category": "image",
  "desc": "Fitur glitchtext <teks>",
  "usage": ".glitchtext <teks>",
  "limit": true
})
