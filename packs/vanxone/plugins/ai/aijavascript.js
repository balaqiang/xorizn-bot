// Fitur ai/aijavascript — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ai/aijavascript", {
  "name": "aijavascript",
  "command": [
    "aijavascript",
    "aijs",
    "aihtml"
  ],
  "category": "ai",
  "desc": "Fitur aijavascript <prompt>",
  "usage": ".aijavascript <prompt>",
  "limit": true
})
