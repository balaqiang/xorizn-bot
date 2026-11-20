// Fitur maker/igqc — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("maker/igqc", {
  "name": "igqc",
  "command": [
    "igqc",
    "igc"
  ],
  "category": "image",
  "desc": "Fitur igc <teks>",
  "usage": ".igc <teks>",
  "limit": true
})
