// Fitur tools/invoicemaker — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/invoicemaker", {
  "name": "invoicemaker",
  "command": [
    "invoicemaker",
    "faktur",
    "nota"
  ],
  "category": "maker",
  "desc": "Membuat invoice/nota penjualan",
  "usage": ".invoicemaker <toko>|<invoice>|<tanggal>|<status>|<items>|<total>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 15,
  "energi": 2,
  "needs": {
    "apikeys": [
      "neoxr"
    ],
    "scrapers": [],
    "assets": []
  }
})
