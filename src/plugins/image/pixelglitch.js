// Fitur ephoto/pixelglitch — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ephoto/pixelglitch", {
  "name": "pixelglitch",
  "command": [
    "pixelglitch"
  ],
  "category": "image",
  "desc": "Fitur pixelglitch <teks>",
  "usage": ".pixelglitch <teks>",
  "limit": true
})
