// Fitur stalker/mcavatar — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("stalker/mcavatar", {
  "name": "mcavatar",
  "command": [
    "mcavatar",
    "avatarmc",
    "mcpfp"
  ],
  "category": "stalker",
  "desc": "Generate avatar Minecraft (face/bust/body/head 3D) dari username/gamertag - Java & Bedrock general, via MCCompanion API",
  "usage": ".mcavatar <username/gamertag> [face|bust|body|head]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
