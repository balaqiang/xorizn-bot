// Fitur maker/jarvis — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("maker/jarvis", {
  "name": "jarvis",
  "command": [
    "jarvis",
    "memejarvis"
  ],
  "category": "image",
  "desc": "Fitur jarvis <teks>",
  "usage": ".jarvis <teks>",
  "limit": true
})
