// Fitur ephoto/writetext — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ephoto/writetext", {
  "name": "writetext",
  "command": [
    "writetext"
  ],
  "category": "image",
  "desc": "Fitur writetext <teks>",
  "usage": ".writetext <teks>",
  "limit": true
})
