// Fitur owner/sendasset — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/sendasset", {
  "name": "sendasset",
  "command": [
    "sendasset",
    "assetbrowser",
    "sendassets",
    "browseasset"
  ],
  "category": "owner",
  "desc": "Asset browser & sender — lihat/kirim aset dari URL di config.assets",
  "usage": ".sendasset [grup] [nama-aset] [--url]",
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
