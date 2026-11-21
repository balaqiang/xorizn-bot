// Fitur ai/hoshinoaivn — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("ai/hoshinoaivn", {
  "name": "hoshinoaivn",
  "command": [
    "hoshinoaivn",
    "hoshinovn",
    "aivn"
  ],
  "category": "ai",
  "desc": "Ngobrol sama vanXone, jawabannya dalam bentuk voice note berbahasa Jepang. Wajib pilih gaya bicara -1 (idol ceria) atau -2 (sisi asli Ai, tenang & dingin). Tambah ",
  "usage": ".hoshinoaivn <-1/-2> [-]<teks>",
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
