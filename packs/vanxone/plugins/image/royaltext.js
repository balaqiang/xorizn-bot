// Fitur ephoto/royaltext — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ephoto/royaltext", {
  "name": "royaltext",
  "command": [
    "royaltext"
  ],
  "category": "image",
  "desc": "Fitur royaltext <teks>",
  "usage": ".royaltext <teks>",
  "limit": true
})
