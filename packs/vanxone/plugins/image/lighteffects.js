// Fitur ephoto/lighteffects — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ephoto/lighteffects", {
  "name": "lighteffects",
  "command": [
    "lighteffects"
  ],
  "category": "image",
  "desc": "Fitur lighteffects <teks>",
  "usage": ".lighteffects <teks>",
  "limit": true
})
