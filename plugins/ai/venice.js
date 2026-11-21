// Fitur ai/venice — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ai/venice", {
  "name": "venice",
  "command": [
    "venice",
    "veniceai"
  ],
  "category": "ai",
  "desc": "Fitur venice <pesan>",
  "usage": ".venice <pesan>",
  "limit": true
})
