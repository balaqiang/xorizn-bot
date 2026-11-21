// Fitur panel/addseller — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("panel/addseller", {
  "name": "addseller",
  "command": [
    "addseller",
    "addreseller",
    "delseller",
    "delreseller",
    "listseller",
    "listreseller"
  ],
  "category": "panel",
  "desc": "Kelola seller/reseller panel",
  "usage": ".addseller @user atau .delseller @user",
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
