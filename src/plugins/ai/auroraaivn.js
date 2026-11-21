// Fitur ai/auroraaivn — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("ai/auroraaivn", {
  "name": "auroraaivn",
  "command": [
    "auroraaivn",
    "auroravn",
    "aivn"
  ],
  "category": "ai",
  "desc": "Ngobrol sama xorizn-bot, jawabannya dalam bentuk voice note berbahasa Jepang. Wajib pilih gaya bicara -1 (idol ceria) atau -2 (sisi asli Ai, tenang & dingin). Tambah ",
  "usage": ".auroraaivn <-1/-2> [-]<teks>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 8,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
