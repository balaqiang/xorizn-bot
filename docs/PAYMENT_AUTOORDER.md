# Payment gateway QRIS otomatis (AutoOrder)

API: https://auto-order.alxzyy.my.id/docs  — konfigurasi di `settings.js` -> `global.autoorder`.

## Perintah
| Perintah | Siapa | Fungsi |
|---|---|---|
| `.bayarqris <kode order>` (alias `.payqris`) | pembeli | bayar order toko lewat QRIS; lunas -> stok berkurang & isi pesanan terkirim otomatis |
| `.topup <nominal>` (alias `.isisaldo`) | semua | isi saldo bot (money), contoh `.topup 10k` |
| `.premqris [hari]` | semua | beli premium berbatas hari (paket di `global.autoorder.premium`) |
| `.statusbayar [kode]` | pemilik tagihan | cek status / tampilkan ulang QR (`.statusbayar PAYxxxx qr`) |
| `.batalbayar <kode>` | pemilik / owner | batalkan tagihan belum dibayar |
| `.riwayatbayar` | pemilik / owner (owner lihat semua) | 10 tagihan terakhir |
| `.aosaldo` (alias `.aoinfo`) | owner | info akun & saldo AutoOrder |

Tombol "Bayar QRIS otomatis" juga muncul di kartu `.beli` kalau API key terisi. Pembayaran manual (DANA/OVO/GoPay/QRIS statis) tetap jalan.

## Nokos OTP (nomor virtual) — saldo bot pembeli dipotong, modal dari saldo AutoOrder kamu
| Perintah | Fungsi |
|---|---|
| `.nokos [cari]` | daftar layanan |
| `.nokosharga <id> [economy\|standard] [negara]` | penawaran per negara |
| `.nokosbeli <id> [economy\|standard] [negara]` atau `offer=<id>` | beli (otomatis pilih termurah yang ada stok) |
| `.nokoscek [order]` / `.nokosbatal <order>` / `.nokosriwayat` | status, batal, riwayat |

OTP masuk dikirim otomatis. Gagal / kedaluwarsa / dibatalkan -> saldo pembeli kembali penuh (sekali saja). Owner membeli gratis.
Harga jual = harga API x (1 + `nokosMarkup.percent`/100) + `flat`, lalu x `topupRate`. Matikan dengan `global.autoorder.nokos = false`.

## Owner
- `.aoorder <productId> nokos <tier> [negara]` / `ptero <username>` / `smm <target> <jumlah>` — endpoint `/order` (docs tidak memberi contoh respon, jadi respon ditampilkan apa adanya)
- `.aoupload [private]` — kirim/balas media, upload ke Storage (di atas 8 MB otomatis per potongan 4 MB)
- `.aofile <id>` — baca isi file `.json` / `.txt`
- Storage memakai header `x-api-key`. Docs menyebut key Storage berformat `ak_live_...`; kalau key AOC tidak diterima, isi `global.autoorder.storageKey`.

## Berkas
- `lib/autoorder.js` — client API (akun, saldo, deposit, cancel) + render QR PNG lokal
- `lib/aonokos.js` + `plugins/store/aonokos.js` — Nokos; `plugins/store/aoextra.js` — order universal & Storage
- `lib/autopay.js` — tagihan, pemantau status (tiap 6-20 detik, patuh batas 1 cek/5 detik), penyerahan barang
- `plugins/store/autopay.js` — perintah; `plugins/store/autopay-hook.js` — lanjut memantau setelah bot restart
- `plugins/store/produk.js` — `.beli` ditambah tombol QRIS otomatis
- Data tagihan: `database/autopay.json`

## Catatan
- Nominal yang dikreditkan = nominal tagihan, bukan `payment_amount` (yang bisa berisi biaya layanan).
- Dana QRIS masuk ke saldo akun AutoOrder milikmu, bukan langsung ke rekening.
- Tagihan ditandai lunas & disimpan SEBELUM barang dikirim, jadi tidak pernah terkirim dobel walau bot restart.
- Kalau pembayaran masuk tapi barang gagal diserahkan (mis. stok habis), status `PAID_ISSUE` dan owner dapat notifikasi "PERLU TINDAKAN" untuk refund / kirim manual.
- Jangan bagikan `settings.js` (berisi API key).
