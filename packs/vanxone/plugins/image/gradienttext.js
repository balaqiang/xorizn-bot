// Fitur ephoto/gradienttext — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ephoto/gradienttext", {
  "name": "gradienttext",
  "command": [
    "gradienttext"
  ],
  "category": "image",
  "desc": "Fitur gradienttext <teks>",
  "usage": ".gradienttext <teks>",
  "limit": true
})
