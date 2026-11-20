// Fitur store_autoorder/kurangisaldo — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("store_autoorder/kurangisaldo", {
  "name": "kurangisaldo",
  "command": [
    "kurangisaldo",
    "delsaldo",
    "minussaldo"
  ],
  "category": "store",
  "desc": "💰 Mengurangi saldo pengguna secara manual",
  "usage": ".kurangisaldo @user <nominal>",
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
