// Fitur fun/gojo-extra — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("fun/gojo-extra", {
  "name": "gojoquote",
  "command": [
    "gojoquote",
    "gojofact",
    "gojohype",
    "gojopower",
    "gojotech"
  ],
  "category": "fun",
  "desc": "Fitur tema Gojo sederhana yang tidak tersedia di xorizn-bot.",
  "usage": ".gquote",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
