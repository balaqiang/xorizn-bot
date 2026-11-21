// Fitur tools/amverif — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/amverif", {
  "name": "amverif",
  "command": [
    "amverif",
    "ampverif",
    "verifyam",
    "amverify"
  ],
  "category": "tools",
  "desc": "Alias: verifikasi AM (pakai .amprem)",
  "usage": ".amverif → gunakan .amprem",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
