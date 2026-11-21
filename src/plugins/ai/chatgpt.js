// Fitur ai/chatgpt — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ai/chatgpt", {
  "name": "chatgpt",
  "command": [
    "chatgpt"
  ],
  "category": "ai",
  "desc": "Fitur chatgpt <pesan>",
  "usage": ".chatgpt <pesan>",
  "limit": true
})
