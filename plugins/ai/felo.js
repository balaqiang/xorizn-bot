// Fitur ai/felo — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ai/felo", {
  "name": "felo",
  "command": [
    "felo",
    "feloai"
  ],
  "category": "ai",
  "desc": "Fitur felo <pertanyaan>",
  "usage": ".felo <pertanyaan>",
  "limit": true
})
