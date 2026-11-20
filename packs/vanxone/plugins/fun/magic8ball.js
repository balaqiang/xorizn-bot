// Fitur fun/magic8ball — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("fun/magic8ball", {
  "name": "magic8ball",
  "command": [
    "magic8ball"
  ],
  "category": "fun",
  "desc": "Fitur magic8ball",
  "usage": ".magic8ball",
  "limit": true
})
