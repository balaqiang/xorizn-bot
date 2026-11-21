// Fitur ephoto/freecreate — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ephoto/freecreate", {
  "name": "freecreate",
  "command": [
    "freecreate"
  ],
  "category": "image",
  "desc": "Fitur freecreate <teks>",
  "usage": ".freecreate <teks>",
  "limit": true
})
