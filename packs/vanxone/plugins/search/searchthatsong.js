// Fitur search/searchthatsong — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/searchthatsong", {
  "name": "searchthatsong",
  "command": [
    "searchthatsong",
    "sts",
    "carilagu"
  ],
  "category": "search",
  "desc": "Mencari detail sebuah lagu dari lirik atau potongan kata",
  "usage": ".searchthatsong <potongan lirik>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
