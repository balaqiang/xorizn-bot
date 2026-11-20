// Fitur store/setdone — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("store/setdone", {
  "name": "setdone",
  "command": [
    "setdone",
    "doneconfig",
    "configdone"
  ],
  "category": "store",
  "desc": "Set template untuk .done",
  "usage": ".setdone template <full text>",
  "owner": true,
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
