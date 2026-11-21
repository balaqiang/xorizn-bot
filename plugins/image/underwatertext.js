// Fitur ephoto/underwatertext — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ephoto/underwatertext", {
  "name": "underwatertext",
  "command": [
    "underwatertext"
  ],
  "category": "image",
  "desc": "Fitur underwatertext <teks>",
  "usage": ".underwatertext <teks>",
  "limit": true
})
