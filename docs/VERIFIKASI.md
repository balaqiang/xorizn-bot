# Verifikasi bot dan dashboard

## Hasil pengujian

| Alur | Yang dijalankan | Hasil yang dapat diperiksa |
|---|---|---|
| `.gambar` lama | Alias classic di handler bot dengan kueri `kucing` | Sumber classic terpilih. Pada pengujian ini API pencarian lama membalas HTTP 403. |
| `.gambar` milik pemilik | Chrome membuka dashboard produksi, menyimpan referensi key, mencoba HTTP, memilih daftar, lalu menyimpan dan mengubah perintah yang sama | Penyedia A dan B menghasilkan thumbnail di browser dan masing-masing mengirim satu PNG ke socket perekam di chat asal. Isi PNG sama dengan salah satu gambar milik penyedia uji. |
| Rahasia | Penyedia memantulkan key di JSON dan URL media bertanda tangan. Satu perintah sengaja gagal sesudah membaca data tersebut | Sampel, jejak langkah, ringkasan balasan, pesan kesalahan tersimpan dan log menyamarkan key. Browser menampilkan thumbnail JPEG dari bot tanpa menghubungi penyedia. |
| Prefix, plugin, pengguna | Instalasi baru memuat inti, classic dan extra. Ubah prefix ke `!`, pilih sumber untuk `ping`, nonaktifkan lalu aktifkan perintah dan ubah limit pengguna. | 2.424 perintah aktif. Sumber `ping` berpindah dari extra ke native. `.unsur Fe` dari classic membaca nomor atom 26. Limit yang dibaca dari dashboard adalah 37. Konfigurasi dengan classic dan extra dimatikan memuat 136 perintah inti. |
| Stiker | Pesan gambar masuk melalui handler dan media Baileys terenkripsi dari server uji lokal | File yang dikirim ke socket perekam adalah WebP 512 × 512. |
| AI | Instans 9router 0.5.119 terisolasi dengan model uji lokal, lalu endpoint OpenAI-compatible lokal lain | Chat asal menerima `balasan melalui 9router` dan `balasan other-test`. Model uji mengembalikan teks tetap. |
| Workflow n8n | n8n 2.48.7 menjalankan dua node, Webhook dan Respond to Webhook. Balasan memuat teks pesan yang diterima. | HTTP 200. Teks `n8n menerima uji-a58ee0a5` sampai ke JID pengirim pada socket perekam. |
| Event dan API masuk | Penerima HTTP uji memeriksa tanda tangan HMAC pada event pesan/perintah. Klien uji memakai token untuk memanggil API masuk. | `n8n/message` dan `n8n/command` kembali ke grup asal. `POST /api/v1/send` mengirim `uji API masuk` ke pengguna simulasi. |
| Penyimpanan | JSON, SQLite, driver MySQL pada MariaDB 11.4.5 dan driver Supabase pada PostgreSQL 18 lokal. Untuk setiap driver, API dashboard memigrasikan tiga baris. Bot dimulai ulang dua kali. | Pembacaan sesudah restart pertama mengembalikan limit 37 dan status diblokir. Perubahan pada driver tujuan terbaca setelah restart kedua dengan limit 41 dan blokir dinonaktifkan. Koneksi ke proyek Supabase terkelola belum diuji. |

**Bukti WhatsApp.** Pengujian chat menggunakan handler asli dengan socket perekam. Nomor, grup dan status koneksi pada dashboard uji adalah data simulasi. Penerimaan pada aplikasi WhatsApp dan pengujian bersama pengguna nonteknis belum diverifikasi.

## Pilihan yang dibandingkan

- **Memilih URL.** Ekspresi lama dengan akhiran `.random`, filter `| random` diikuti pembacaan kolom, dan langkah acak dengan path daftar semuanya berhasil pada dua penyedia. Saat daftar berubah menjadi objek `{a: url1, b: url2}`, kedua ekspresi pertama masih mengembalikan URL. Langkah acak memberi tahu bahwa kolom harus berupa daftar. Karena itu preset memakai langkah acak eksplisit. Path dan kolom item tetap bisa diketik ketika sampel dipotong.
- **Menguji endpoint.** Saat berpindah ke B dengan path A, uji seluruh perintah berhenti di langkah 2. Menjalankan sampai langkah HTTP saja menghasilkan sampel `data.items` yang dapat langsung dipilih. **Coba permintaan** dipakai untuk menemukan bentuk respons dan **▶ Coba** untuk memeriksa hasil lengkap.
- **Mempratinjau gambar.** Permintaan ke URL media uji dengan key yang disamarkan mendapat HTTP 401. Thumbnail dari byte gambar yang sudah diambil bot berhasil dibaca di Chrome. Karena itu browser memakai thumbnail yang dikirim bot.
- **Membaca balasan AI.** Permintaan yang sama melalui 9router menghasilkan `text/event-stream` saat opsi streaming dihilangkan dan `application/json` saat `stream: false`. Klien bot membaca JSON dan menggunakan pilihan kedua.

## Mengulang dari checkout ini

Jalankan `npm install` di root sesuai panduan instalasi. Dashboard hasil build ada di `dashboard/out`. Setelah mengubah kode dashboard, jalankan `npm run build:dashboard` sebelum membuat instans uji. Skrip UI membutuhkan Chrome/Chromium dan menerima variabel `CHROME_PATH`.

```powershell
node --test test/gambar.test.mjs
$s = ".claude/skills/verify-xorizn-bot/scripts"
node "$s/up.mjs" --name uji-gambar --packs default
node "$s/chat.mjs" --name uji-gambar ".gambar kucing"
node "$s/gambar-ui.mjs" --name uji-gambar
node "$s/integrations.mjs" --name uji-gambar
# Jika 9router terpasang secara global
node "$s/router.mjs" --name uji-gambar --app "$(npm root -g)/9router/app"
node "$s/down.mjs" --name uji-gambar
```

`up.mjs` membuat bot sekali pakai dengan database, port dan password sendiri. `--packs default` memakai pilihan paket instalasi baru. Jalankan uji browser saat belum ada perintah kustom bernama `gambar` di instans tersebut. Screenshot, rekaman chat dan file media tersimpan di `.verify/evidence/uji-gambar/` setelah instans ditutup.

### Workflow n8n nyata

Pada terminal dengan n8n 2.48.7 dan Node 24 atau lebih baru, jalankan dari root repo. Perintah ini membuat ruang data n8n tersendiri.

```powershell
$env:N8N_USER_FOLDER = Join-Path ([IO.Path]::GetTempPath()) ("n8n-bot-" + [guid]::NewGuid())
$env:N8N_LISTEN_ADDRESS = "127.0.0.1"
n8n import:workflow --input=test/fixtures/n8n-reply.json
n8n publish:workflow --id=simulasichat0001
n8n start
```

Di terminal kedua, jalankan bot uji dan daftarkan webhook melalui API dashboard. Operasi ini sama dengan memilih event pesan dan mengaktifkan **Balas dari n8n** di halaman **Integrasi (n8n)**. Cocokkan JID dan teks balasan dalam rekaman chat.

```powershell
$s = ".claude/skills/verify-xorizn-bot/scripts"
node "$s/up.mjs" --name uji-n8n --packs core
node "$s/api.mjs" --name uji-n8n PUT /api/integrations/webhooks '{"webhooks":[{"url":"http://127.0.0.1:5678/webhook/simulasi-chat","events":["message"],"reply":true}]}'
node "$s/chat.mjs" --name uji-n8n --expect "n8n menerima uji" uji
node "$s/down.mjs" --name uji-n8n
```

Hentikan n8n dengan Ctrl+C setelah pengujian.

### Restart dengan driver pilihan

```powershell
node "$s/storage-restart.mjs" json
node "$s/storage-restart.mjs" sqlite
node "$s/storage-restart.mjs" mysql /path/ke/mysql-uji.json
node "$s/storage-restart.mjs" postgres /path/ke/postgres-uji.json
```

Gunakan server uji untuk MySQL atau PostgreSQL. File opsi berisi satu objek koneksi, misalnya `{"host":"127.0.0.1","port":3306,"user":"penguji","password":"..."}` untuk MySQL atau `{"connectionString":"postgresql://penguji:...@host:5432/postgres","ssl":true}` untuk Supabase. Skrip membuat database MySQL atau tabel PostgreSQL unik, menguji dua restart, lalu mencetak nama target dan nilai pengguna akhir. Kredensial dari server produksi tidak diperlukan.

Untuk memeriksa penerimaan nyata, hubungkan akun uji melalui **Hubungkan WhatsApp**, kirim `.gambar` dari chat uji dan periksa foto di aplikasi penerima setelah setiap pergantian penyedia. Untuk uji pengguna nonteknis, berikan endpoint dan key uji kepada peserta lalu minta mereka mengganti penyedia sendiri. Catat apakah peserta menemukan daftar dan kolom URL, perlu bantuan, dan berhasil menerima gambar.
