// Fitur store_autoorder/tambahsaldo — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("store_autoorder/tambahsaldo", {
  "name": "tambahsaldo",
  "command": [
    "tambahsaldo",
    "addsaldo"
  ],
  "category": "store",
  "desc": "💰 Menambah saldo pengguna secara manual",
  "usage": ".tambahsaldo @user <nominal>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
