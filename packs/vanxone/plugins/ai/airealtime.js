// Fitur ai/airealtime — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ai/airealtime", {
  "name": "airealtime",
  "command": [
    "airealtime",
    "aireal",
    "airealt"
  ],
  "category": "ai",
  "desc": "Fitur airealtime <pertanyaan>",
  "usage": ".airealtime <pertanyaan>",
  "limit": true
})
