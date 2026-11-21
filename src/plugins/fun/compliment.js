// Fitur fun/compliment — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("fun/compliment", {
  "name": "compliment",
  "command": [
    "compliment",
    "puji"
  ],
  "category": "fun",
  "desc": "Fitur compliment",
  "usage": ".compliment",
  "limit": true
})
