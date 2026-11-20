// Fitur ai-image/topanda — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ai-image/topanda", {
  "name": "topanda",
  "command": [
    "topanda"
  ],
  "category": "ai",
  "desc": "Fitur topanda (reply foto)",
  "usage": ".topanda (reply foto)",
  "limit": true
})
