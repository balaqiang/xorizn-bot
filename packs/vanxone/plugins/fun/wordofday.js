// Fitur fun/wordofday — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("fun/wordofday", {
  "name": "wordofday",
  "command": [
    "wordofday",
    "katabijak"
  ],
  "category": "fun",
  "desc": "Fitur wordofday",
  "usage": ".wordofday",
  "limit": true
})
