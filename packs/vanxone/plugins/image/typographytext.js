// Fitur ephoto/typographytext — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ephoto/typographytext", {
  "name": "typographytext",
  "command": [
    "typographytext"
  ],
  "category": "image",
  "desc": "Fitur typographytext <teks>",
  "usage": ".typographytext <teks>",
  "limit": true
})
