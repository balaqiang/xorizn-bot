// Fitur ephoto/deletingtext — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ephoto/deletingtext", {
  "name": "deletingtext",
  "command": [
    "deletingtext"
  ],
  "category": "image",
  "desc": "Fitur deletingtext <teks>",
  "usage": ".deletingtext <teks>",
  "limit": true
})
