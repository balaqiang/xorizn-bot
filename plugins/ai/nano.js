// Fitur ai-image/nano — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ai-image/nano", {
  "name": "nano",
  "command": [
    "nano",
    "nanobanana"
  ],
  "category": "ai",
  "desc": "Fitur nano <prompt>",
  "usage": ".nano <prompt>",
  "limit": true
})
