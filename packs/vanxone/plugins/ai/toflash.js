// Fitur ai-image/toflash — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ai-image/toflash", {
  "name": "toflash",
  "command": [
    "toflash"
  ],
  "category": "ai",
  "desc": "Fitur toflash (reply foto)",
  "usage": ".toflash (reply foto)",
  "limit": true
})
