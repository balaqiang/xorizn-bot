// Fitur fun/wordscramble — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("fun/wordscramble", {
  "name": "wordscramble",
  "command": [
    "wordscramble",
    "scramble",
    "jawabscramble"
  ],
  "category": "fun",
  "desc": "Fitur wordscramble",
  "usage": ".wordscramble",
  "limit": true
})
