// Bank kata & logika hangman (kategori: kata)
const WORDS = {
  Hewan: ['kucing', 'harimau', 'jerapah', 'kelinci', 'kambing', 'bebek', 'burung', 'buaya', 'kupu', 'komodo', 'orangutan', 'cicak', 'lumba', 'penyu'],
  Buah: ['mangga', 'jeruk', 'pisang', 'semangka', 'durian', 'rambutan', 'nanas', 'apel', 'anggur', 'salak', 'melon', 'manggis'],
  Makanan: ['rendang', 'bakso', 'gudeg', 'sate', 'soto', 'gado', 'nasi', 'tempe', 'pempek', 'martabak', 'ketupat', 'siomay'],
  Kota: ['jakarta', 'bandung', 'surabaya', 'medan', 'makassar', 'palembang', 'semarang', 'yogyakarta', 'pontianak', 'denpasar', 'balikpapan', 'padang'],
  Benda: ['kursi', 'lemari', 'televisi', 'payung', 'kompor', 'sepatu', 'kacamata', 'dompet', 'jendela', 'kulkas', 'gitar', 'sepeda'],
  Teknologi: ['komputer', 'internet', 'keyboard', 'aplikasi', 'browser', 'password', 'server', 'program', 'laptop', 'kamera', 'router', 'database']
}

function randomWord(random = Math.random) {
  const cats = Object.keys(WORDS)
  const cat = cats[Math.floor(random() * cats.length)]
  const list = WORDS[cat]
  return { category: cat, word: list[Math.floor(random() * list.length)] }
}

const masked = (word, guessed) => [...word].map((c) => (guessed.has(c) ? c.toUpperCase() : '＿')).join(' ')
const solved = (word, guessed) => [...word].every((c) => guessed.has(c))

module.exports = { WORDS, randomWord, masked, solved }
