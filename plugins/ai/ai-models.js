// Fitur ai/ai-models — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("ai/ai-models", {
  "name": "webpilot",
  "command": [
    "webpilot",
    "gpt-oss2b",
    "glm47",
    "meta-ai",
    "deepseek-pro",
    "claude-45"
  ],
  "category": "ai",
  "desc": "Model AI tambahan yang dipindahkan dari Aqua",
  "usage": ".webpilot <pertanyaan>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
