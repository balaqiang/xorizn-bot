// Fitur ephoto/rainytext — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ephoto/rainytext", {
  "name": "rainytext",
  "command": [
    "rainytext"
  ],
  "category": "image",
  "desc": "Fitur rainytext <teks>",
  "usage": ".rainytext <teks>",
  "limit": true
})
