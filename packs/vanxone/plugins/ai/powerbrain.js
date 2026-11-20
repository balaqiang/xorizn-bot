// Fitur ai/powerbrain — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ai/powerbrain", {
  "name": "powerbrain",
  "command": [
    "powerbrain",
    "powerbrainai"
  ],
  "category": "ai",
  "desc": "Fitur powerbrain <pertanyaan>",
  "usage": ".powerbrain <pertanyaan>",
  "limit": true
})
