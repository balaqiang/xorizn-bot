// Fitur tools/qrcodefile — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/qrcodefile", {
  "name": "qrcodefile",
  "command": [
    "qrcodefile",
    "qrfile",
    "fileqr",
    "filetoqr",
    "qruguu"
  ],
  "category": "tools",
  "desc": "Mengupload media/file ke hosting cadangan dan membuat QR Code berisi URL file tersebut",
  "usage": ".qrcodefile (kirim dengan caption atau reply media/file/viewonce/dokumen)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
