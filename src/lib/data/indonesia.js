// Data provinsi (38) & kode plat nomor kendaraan Indonesia
// provinsi: nama | ibukota | wilayah
const PROVINSI = `Aceh|Banda Aceh|Sumatera
Sumatera Utara|Medan|Sumatera
Sumatera Barat|Padang|Sumatera
Riau|Pekanbaru|Sumatera
Kepulauan Riau|Tanjungpinang|Sumatera
Jambi|Jambi|Sumatera
Sumatera Selatan|Palembang|Sumatera
Kepulauan Bangka Belitung|Pangkalpinang|Sumatera
Bengkulu|Bengkulu|Sumatera
Lampung|Bandar Lampung|Sumatera
Banten|Serang|Jawa
DKI Jakarta|Jakarta|Jawa
Jawa Barat|Bandung|Jawa
Jawa Tengah|Semarang|Jawa
DI Yogyakarta|Yogyakarta|Jawa
Jawa Timur|Surabaya|Jawa
Bali|Denpasar|Bali & Nusa Tenggara
Nusa Tenggara Barat|Mataram|Bali & Nusa Tenggara
Nusa Tenggara Timur|Kupang|Bali & Nusa Tenggara
Kalimantan Barat|Pontianak|Kalimantan
Kalimantan Tengah|Palangka Raya|Kalimantan
Kalimantan Selatan|Banjarmasin|Kalimantan
Kalimantan Timur|Samarinda|Kalimantan
Kalimantan Utara|Tanjung Selor|Kalimantan
Sulawesi Utara|Manado|Sulawesi
Gorontalo|Gorontalo|Sulawesi
Sulawesi Tengah|Palu|Sulawesi
Sulawesi Barat|Mamuju|Sulawesi
Sulawesi Selatan|Makassar|Sulawesi
Sulawesi Tenggara|Kendari|Sulawesi
Maluku|Ambon|Maluku
Maluku Utara|Sofifi|Maluku
Papua|Jayapura|Papua
Papua Barat|Manokwari|Papua
Papua Barat Daya|Sorong|Papua
Papua Selatan|Merauke|Papua
Papua Tengah|Nabire|Papua
Papua Pegunungan|Wamena|Papua`
  .split('\n')
  .map((l) => {
    const [nama, ibukota, wilayah] = l.split('|')
    return { nama, ibukota, wilayah }
  })

// kode plat -> wilayah (huruf awal pada pelat; bisa berubah karena pemekaran)
const PLAT = `A|Banten (Serang, Cilegon, Pandeglang, Lebak)
B|DKI Jakarta, Kota/Kab. Tangerang, Tangerang Selatan, Bekasi, Depok
D|Bandung dan sekitarnya (Jawa Barat)
E|Cirebon, Indramayu, Majalengka, Kuningan (Jawa Barat)
F|Bogor, Sukabumi, Cianjur (Jawa Barat)
T|Karawang, Purwakarta, Subang (Jawa Barat)
Z|Garut, Tasikmalaya, Sumedang, Ciamis, Banjar (Jawa Barat)
G|Pekalongan, Tegal, Brebes, Batang (Jawa Tengah)
H|Semarang, Kendal, Salatiga, Demak (Jawa Tengah)
K|Pati, Kudus, Jepara, Rembang, Blora (Jawa Tengah)
R|Banyumas, Cilacap, Purbalingga (Jawa Tengah)
AA|Kedu: Magelang, Purworejo, Temanggung, Kebumen (Jawa Tengah)
AD|Surakarta, Sukoharjo, Klaten, Boyolali, Karanganyar (Jawa Tengah)
AB|DI Yogyakarta
L|Surabaya (Jawa Timur)
M|Madura (Jawa Timur)
N|Malang, Probolinggo, Pasuruan, Lumajang (Jawa Timur)
P|Besuki: Jember, Banyuwangi, Bondowoso (Jawa Timur)
S|Bojonegoro, Lamongan, Tuban, Mojokerto, Jombang (Jawa Timur)
W|Sidoarjo, Gresik (Jawa Timur)
AE|Madiun, Ngawi, Magetan, Ponorogo (Jawa Timur)
AG|Kediri, Blitar, Tulungagung, Nganjuk (Jawa Timur)
DK|Bali
DR|Lombok (Nusa Tenggara Barat)
EA|Sumbawa (Nusa Tenggara Barat)
DH|Timor (Nusa Tenggara Timur)
EB|Flores (Nusa Tenggara Timur)
ED|Sumba (Nusa Tenggara Timur)
BL|Aceh
BB|Sumatera Utara bagian barat (Tapanuli, Sibolga)
BK|Sumatera Utara bagian timur (Medan, Deli Serdang)
BA|Sumatera Barat
BM|Riau
BP|Kepulauan Riau
BH|Jambi
BG|Sumatera Selatan
BN|Kepulauan Bangka Belitung
BD|Bengkulu
BE|Lampung
KB|Kalimantan Barat
DA|Kalimantan Selatan
KH|Kalimantan Tengah
KT|Kalimantan Timur & Kalimantan Utara
DB|Sulawesi Utara (Manado, Minahasa)
DL|Kepulauan Sangihe & Talaud (Sulawesi Utara)
DM|Gorontalo
DN|Sulawesi Tengah
DC|Sulawesi Barat
DD|Sulawesi Selatan
DT|Sulawesi Tenggara
DE|Maluku
DG|Maluku Utara
PA|Papua
PB|Papua Barat`
  .split('\n')
  .map((l) => {
    const i = l.indexOf('|')
    return { kode: l.slice(0, i), wilayah: l.slice(i + 1) }
  })

module.exports = { PROVINSI, PLAT }
