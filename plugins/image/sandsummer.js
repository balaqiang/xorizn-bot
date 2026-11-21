// Fitur ephoto/sandsummer — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ephoto/sandsummer", {
  "name": "sandsummer",
  "command": [
    "sandsummer"
  ],
  "category": "image",
  "desc": "Fitur sandsummer <teks>",
  "usage": ".sandsummer <teks>",
  "limit": true
})
