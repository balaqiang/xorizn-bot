// Fitur ephoto/cartoonstyle — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ephoto/cartoonstyle", {
  "name": "cartoonstyle",
  "command": [
    "cartoonstyle"
  ],
  "category": "image",
  "desc": "Fitur cartoonstyle <teks>",
  "usage": ".cartoonstyle <teks>",
  "limit": true
})
