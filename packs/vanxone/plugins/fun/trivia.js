// Fitur fun/trivia — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("fun/trivia", {
  "name": "trivia",
  "command": [
    "trivia",
    "jawabtrivia"
  ],
  "category": "fun",
  "desc": "Fitur trivia",
  "usage": ".trivia",
  "limit": true
})
