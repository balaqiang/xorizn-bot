// Fitur ai-image/aiedit — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ai-image/aiedit", {
  "name": "aiedit",
  "command": [
    "aiedit"
  ],
  "category": "ai",
  "desc": "Fitur aiedit <prompt>",
  "usage": ".aiedit <prompt>",
  "limit": true
})
