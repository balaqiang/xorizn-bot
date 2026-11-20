// Fitur ai/alya — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ai/alya", {
  "name": "alya",
  "command": [
    "alya"
  ],
  "category": "ai",
  "desc": "Fitur alya <pesan>",
  "usage": ".alya <pesan>",
  "limit": true
})
