// Fitur search/pap — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/pap", {
  "name": "pap",
  "command": [
    "pap",
    "papcewe",
    "papcowo",
    "papfemboy"
  ],
  "category": "search",
  "desc": "Minta pap cewe, cowo, atau femboy dari Pinterest",
  "usage": ".pap <cewe/cowo/femboy>",
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
