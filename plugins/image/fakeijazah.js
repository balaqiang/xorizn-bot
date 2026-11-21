// Fitur canvas/fakeijazah — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("canvas/fakeijazah", {
  "name": "fakeijazah",
  "command": [
    "fakeijazah",
    "ijazahfake",
    "fakediploma"
  ],
  "category": "image",
  "desc": "Bikin fake ijazah (buat konten/gaguan doang)",
  "usage": ".fakeijazah <nama> | <gelar> | <universitas>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 8,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
