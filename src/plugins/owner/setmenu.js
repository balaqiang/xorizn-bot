// Fitur main/setmenu — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("main/setmenu", {
  "name": "setmenu",
  "command": [
    "setmenu"
  ],
  "category": "owner",
  "desc": "Ganti tipe tampilan menu",
  "usage": ".setmenu 1-7",
  "owner": true
})
