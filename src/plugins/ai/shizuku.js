// Fitur ai/shizuku — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ai/shizuku", {
  "name": "shizuku",
  "command": [
    "shizuku"
  ],
  "category": "ai",
  "desc": "Fitur shizuku <pesan>",
  "usage": ".shizuku <pesan>",
  "limit": true
})
