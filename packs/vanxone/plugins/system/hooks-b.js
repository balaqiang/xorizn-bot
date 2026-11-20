// Fitur _hooks — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').hook([
  {
    "rel": "ai/characterai",
    "fns": [
      "caiAnswerHandler",
      "caiChatHandler"
    ]
  },
  {
    "rel": "fun/tembak",
    "fns": [
      "answerHandler"
    ]
  },
  {
    "rel": "game/dungeon",
    "fns": [
      "dungeonAnswerHandler"
    ]
  },
  {
    "rel": "game/family100",
    "fns": [
      "family100AnswerHandler"
    ]
  },
  {
    "rel": "game/kyubigame",
    "fns": [
      "kyubigameAnswerHandler"
    ]
  },
  {
    "rel": "game/suitpvp",
    "fns": [
      "answerHandler"
    ]
  },
  {
    "rel": "game/ulartangga",
    "fns": [
      "answerHandler"
    ]
  },
  {
    "rel": "search/comparation",
    "fns": [
      "comparationAnswerHandler"
    ]
  },
  {
    "rel": "search/resep",
    "fns": [
      "resepAnswerHandler"
    ]
  },
  {
    "rel": "sticker/stickerly",
    "fns": [
      "stickerlyAnswerHandler"
    ]
  },
  {
    "rel": "owner/ganti-asset",
    "fns": [
      "gantiAssetAnswerHandler"
    ]
  },
  {
    "rel": "owner/srt",
    "fns": [
      "srtAnswerHandler"
    ]
  },
  {
    "rel": "tools/dafont",
    "fns": [
      "dafontAnswerHandler"
    ]
  }
])
