// Bank soal kuis & generator soal. Format soal: [pertanyaan, jawaban benar, [3 jawaban salah]]
const QUESTIONS = [
  ['Apa ibu kota Australia?', 'Canberra', ['Sydney', 'Melbourne', 'Perth']],
  ['Planet yang paling dekat dengan Matahari adalah...', 'Merkurius', ['Venus', 'Mars', 'Bumi']],
  ['Hewan darat terbesar di dunia adalah...', 'Gajah afrika', ['Jerapah', 'Badak', 'Kuda nil']],
  ['Indonesia memproklamasikan kemerdekaan pada tahun...', '1945', ['1942', '1949', '1950']],
  ['Siapa presiden pertama Republik Indonesia?', 'Soekarno', ['Soeharto', 'B.J. Habibie', 'Abdurrahman Wahid']],
  ['Lambang unsur kimia untuk emas adalah...', 'Au', ['Ag', 'Fe', 'Go']],
  ['Gunung tertinggi di dunia adalah...', 'Everest', ['K2', 'Kilimanjaro', 'Elbrus']],
  ['Benua terluas di dunia adalah...', 'Asia', ['Afrika', 'Amerika Utara', 'Eropa']],
  ['Samudra terluas di dunia adalah...', 'Pasifik', ['Atlantik', 'Hindia', 'Arktik']],
  ['Apa ibu kota Jepang?', 'Tokyo', ['Osaka', 'Kyoto', 'Seoul']],
  ['Apa ibu kota Korea Selatan?', 'Seoul', ['Busan', 'Pyongyang', 'Tokyo']],
  ['Apa ibu kota Thailand?', 'Bangkok', ['Hanoi', 'Manila', 'Phnom Penh']],
  ['Apa ibu kota Malaysia?', 'Kuala Lumpur', ['Johor Bahru', 'Penang', 'Kuching']],
  ['Siapa pencipta lagu Indonesia Raya?', 'W.R. Supratman', ['Ismail Marzuki', 'C. Simanjuntak', 'Kusbini']],
  ['Candi Buddha terbesar di dunia adalah...', 'Borobudur', ['Prambanan', 'Sewu', 'Mendut']],
  ['Zat hijau daun disebut...', 'Klorofil', ['Hemoglobin', 'Melanin', 'Keratin']],
  ['Gas yang dibutuhkan manusia untuk bernapas adalah...', 'Oksigen', ['Nitrogen', 'Karbon dioksida', 'Hidrogen']],
  ['Planet yang terkenal dengan cincinnya adalah...', 'Saturnus', ['Mars', 'Merkurius', 'Venus']],
  ['Berapa pemain dalam satu tim sepak bola yang berada di lapangan?', '11', ['9', '10', '12']],
  ['Siapa juara Piala Dunia FIFA 2022?', 'Argentina', ['Prancis', 'Kroasia', 'Maroko']],
  ['Siapa pelukis Mona Lisa?', 'Leonardo da Vinci', ['Michelangelo', 'Pablo Picasso', 'Vincent van Gogh']],
  ['Bahasa resmi negara Brasil adalah...', 'Portugis', ['Spanyol', 'Inggris', 'Prancis']],
  ['Mata uang negara Jepang adalah...', 'Yen', ['Won', 'Yuan', 'Ringgit']],
  ['Air mendidih pada suhu berapa derajat Celsius (tekanan normal)?', '100', ['90', '110', '120']],
  ['Rumus kimia air adalah...', 'H2O', ['CO2', 'O2', 'NaCl']],
  ['Organ yang memompa darah ke seluruh tubuh adalah...', 'Jantung', ['Paru-paru', 'Hati', 'Ginjal']],
  ['Mamalia yang dapat terbang adalah...', 'Kelelawar', ['Burung hantu', 'Tupai terbang', 'Elang']],
  ['Danau Toba terletak di provinsi...', 'Sumatera Utara', ['Sumatera Barat', 'Aceh', 'Riau']],
  ['Tari Reog berasal dari daerah...', 'Ponorogo', ['Banyuwangi', 'Cirebon', 'Surakarta']],
  ['Alat musik angklung berasal dari daerah...', 'Jawa Barat', ['Jawa Timur', 'Bali', 'Sumatera Barat']],
  ['Pahlawan perempuan asal Aceh yang melawan Belanda adalah...', 'Cut Nyak Dhien', ['R.A. Kartini', 'Dewi Sartika', 'Martha Christina Tiahahu']],
  ['Mesir terletak di benua...', 'Afrika', ['Asia', 'Eropa', 'Amerika']],
  ['Pelangi memiliki berapa warna?', '7', ['5', '6', '8']],
  ['Hewan darat tercepat di dunia adalah...', 'Cheetah', ['Singa', 'Kuda', 'Harimau']],
  ['Planet yang dijuluki planet merah adalah...', 'Mars', ['Venus', 'Jupiter', 'Saturnus']],
  ['Organ terbesar pada tubuh manusia adalah...', 'Kulit', ['Hati', 'Usus', 'Paru-paru']],
  ['Siapa yang mengemukakan teori relativitas?', 'Albert Einstein', ['Isaac Newton', 'Nikola Tesla', 'Galileo Galilei']],
  ['Apa ibu kota Filipina?', 'Manila', ['Cebu', 'Jakarta', 'Davao']],
  ['Apa ibu kota Vietnam?', 'Hanoi', ['Ho Chi Minh', 'Bangkok', 'Vientiane']],
  ['Lambang negara Indonesia adalah...', 'Garuda Pancasila', ['Elang Jawa', 'Banteng', 'Bintang Emas']],
  ['Singkatan HTML adalah...', 'HyperText Markup Language', ['High Text Machine Language', 'Hyper Tool Multi Language', 'Home Text Markup Level']],
  ['Siapa pendiri Microsoft bersama Paul Allen?', 'Bill Gates', ['Steve Jobs', 'Mark Zuckerberg', 'Elon Musk']],
  ['Singkatan CPU adalah...', 'Central Processing Unit', ['Computer Power Unit', 'Central Program Utility', 'Core Processing Utility']],
  ['Satuan gaya dalam sistem SI adalah...', 'Newton', ['Joule', 'Watt', 'Pascal']],
  ['Gas yang paling banyak di atmosfer Bumi adalah...', 'Nitrogen', ['Oksigen', 'Karbon dioksida', 'Argon']],
  ['Ibu kota provinsi Jawa Timur adalah...', 'Surabaya', ['Malang', 'Semarang', 'Bandung']],
  ['Sumpah Pemuda diikrarkan pada tahun...', '1928', ['1908', '1945', '1950']],
  ['Konferensi Asia Afrika tahun 1955 diadakan di kota...', 'Bandung', ['Jakarta', 'Yogyakarta', 'Surabaya']],
  ['Candi Borobudur dibangun pada masa dinasti...', 'Syailendra', ['Sanjaya', 'Majapahit', 'Mataram Islam']],
  ['Siapa penulis novel Laskar Pelangi?', 'Andrea Hirata', ['Tere Liye', 'Dee Lestari', 'Habiburrahman El Shirazy']],
  ['Siapa penulis novel Bumi Manusia?', 'Pramoedya Ananta Toer', ['Chairil Anwar', 'Buya Hamka', 'Ahmad Tohari']],
  ['Berapa derajat besar sudut siku-siku?', '90', ['45', '60', '180']],
  ['Perusahaan yang memiliki WhatsApp adalah...', 'Meta', ['Google', 'Microsoft', 'Apple']],
  ['Ibu kota Sumatera Barat adalah...', 'Padang', ['Medan', 'Palembang', 'Pekanbaru']]
]

// Bendera: kode negara ISO -> nama Indonesia (emoji bendera dibentuk dari kode)
const COUNTRIES = {
  ID: 'Indonesia', MY: 'Malaysia', SG: 'Singapura', TH: 'Thailand', PH: 'Filipina', VN: 'Vietnam',
  JP: 'Jepang', KR: 'Korea Selatan', CN: 'Tiongkok', IN: 'India', SA: 'Arab Saudi', TR: 'Turki',
  EG: 'Mesir', ZA: 'Afrika Selatan', NG: 'Nigeria', BR: 'Brasil', AR: 'Argentina', MX: 'Meksiko',
  CA: 'Kanada', US: 'Amerika Serikat', GB: 'Inggris', FR: 'Prancis', DE: 'Jerman', IT: 'Italia',
  ES: 'Spanyol', PT: 'Portugal', NL: 'Belanda', RU: 'Rusia', AU: 'Australia', NZ: 'Selandia Baru',
  SE: 'Swedia', CH: 'Swiss', GR: 'Yunani', PK: 'Pakistan', BD: 'Bangladesh', KE: 'Kenya',
  CL: 'Chili', CO: 'Kolombia', PE: 'Peru', NO: 'Norwegia'
}
const flag = (code) => [...code].map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65)).join('')

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const sample = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n)

// Acak urutan pilihan; kembalikan { options, correct }
function shuffleOptions(correct, wrong) {
  const options = sample([correct, ...wrong], 1 + wrong.length)
  return { options, correct: options.indexOf(correct) }
}

function randomQuestion() {
  const [q, answer, wrong] = QUESTIONS[rand(0, QUESTIONS.length - 1)]
  return { text: q, ...shuffleOptions(answer, wrong) }
}

function randomFlag() {
  const codes = Object.keys(COUNTRIES)
  const code = codes[rand(0, codes.length - 1)]
  const wrong = sample(codes.filter((c) => c !== code), 3).map((c) => COUNTRIES[c])
  return { text: `Bendera negara apakah ini?\n\n${flag(code)}`, ...shuffleOptions(COUNTRIES[code], wrong) }
}

// Soal hitungan. level: mudah | sedang | sulit
const LEVELS = {
  mudah: { reward: 5000, ttl: 20 },
  sedang: { reward: 10000, ttl: 30 },
  sulit: { reward: 20000, ttl: 45 }
}

function mathQuestion(level = 'mudah') {
  let expr
  let answer
  if (level === 'mudah') {
    const a = rand(2, 50)
    const b = rand(2, 50)
    const plus = Math.random() < 0.5
    expr = plus ? `${a} + ${b}` : `${Math.max(a, b)} - ${Math.min(a, b)}`
    answer = plus ? a + b : Math.max(a, b) - Math.min(a, b)
  } else if (level === 'sedang') {
    if (Math.random() < 0.5) {
      const a = rand(3, 20)
      const b = rand(3, 20)
      expr = `${a} × ${b}`
      answer = a * b
    } else {
      const a = rand(100, 999)
      const b = rand(100, 999)
      expr = `${a} + ${b}`
      answer = a + b
    }
  } else {
    const a = rand(3, 15)
    const b = rand(3, 15)
    const c = rand(10, 99)
    if (Math.random() < 0.5) {
      expr = `${a} × ${b} + ${c}`
      answer = a * b + c
    } else {
      expr = `(${a} + ${b}) × ${rand(3, 12)}`
      // hitung ulang dari string agar konsisten
      const m = expr.match(/\((\d+) \+ (\d+)\) × (\d+)/)
      answer = (Number(m[1]) + Number(m[2])) * Number(m[3])
    }
  }

  const wrong = new Set()
  while (wrong.size < 3) {
    const off = rand(1, Math.max(5, Math.floor(Math.abs(answer) * 0.15))) * (Math.random() < 0.5 ? -1 : 1)
    if (answer + off !== answer) wrong.add(answer + off)
  }
  return { text: `Berapa hasil dari:\n\n*${expr}*`, ...shuffleOptions(String(answer), [...wrong].map(String)), expr, answer }
}

module.exports = { QUESTIONS, COUNTRIES, LEVELS, flag, randomQuestion, randomFlag, mathQuestion }
