// Fitur maker/fakecall — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("maker/fakecall", {
  "name": "fakecall",
  "command": [
    "fakecall",
    "fakevc"
  ],
  "category": "image",
  "desc": "Fitur fakecall <nama | durasi>",
  "usage": ".fakecall <nama | durasi>",
  "limit": true
})
