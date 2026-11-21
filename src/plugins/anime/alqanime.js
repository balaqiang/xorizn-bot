// Fitur anime/alqanime — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("anime/alqanime", {
  "name": "alqanime",
  "command": [
    "alqanime"
  ],
  "category": "anime",
  "desc": "Fitur alqanime <on|off|status|test>",
  "usage": ".alqanime <on|off|status|test>",
  "group": true,
  "admin": true
})
