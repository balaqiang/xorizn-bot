// Shim xorizn-bot: buttons-send.js milik ZeroTwo meng-import '../import.js' (import global ZeroTwo yang berat).
// Di xorizn-bot cukup menyediakan global yang dipakai helper pengirim.
const polls = {}
if (typeof global.getPollCommands !== 'function') global.getPollCommands = () => polls
export {}
