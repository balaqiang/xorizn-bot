// Fitur ai/gemini — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ai/gemini", {
  "name": "gemini",
  "command": [
    "gemini",
    "bard"
  ],
  "category": "ai",
  "desc": "Fitur gemini <pesan>",
  "usage": ".gemini <pesan>",
  "limit": true
})
