// Fitur main/menu — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("main/menu", {
  "name": "menu",
  "command": [
    "menu",
    "help"
  ],
  "category": "info",
  "desc": "Tampilkan daftar perintah",
  "usage": ".menu [kategori|all]"
})
