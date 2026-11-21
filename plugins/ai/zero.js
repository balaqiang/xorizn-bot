// Fitur ai/zero — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ai/zero", {
  "name": "zero",
  "command": [
    "zero"
  ],
  "category": "ai",
  "desc": "Fitur zero <pesan>",
  "usage": ".zero <pesan>",
  "limit": true
})
