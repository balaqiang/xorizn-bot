// Fitur ai/sakana — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ai/sakana", {
  "name": "sakana",
  "command": [
    "sakana",
    "sakanaai"
  ],
  "category": "ai",
  "desc": "Fitur sakana <pertanyaan>",
  "usage": ".sakana <pertanyaan>",
  "limit": true
})
