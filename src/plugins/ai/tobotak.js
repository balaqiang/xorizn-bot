// Fitur ai-image/tobotak — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ai-image/tobotak", {
  "name": "tobotak",
  "command": [
    "tobotak"
  ],
  "category": "ai",
  "desc": "Fitur tobotak (reply gambar)",
  "usage": ".tobotak (reply gambar)",
  "limit": true
})
