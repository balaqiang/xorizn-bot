// Singkatan umum bahasa Indonesia: singkatan|kepanjangan
const SINGKATAN = `TNI|Tentara Nasional Indonesia
POLRI|Kepolisian Negara Republik Indonesia
BUMN|Badan Usaha Milik Negara
BUMD|Badan Usaha Milik Daerah
KTP|Kartu Tanda Penduduk
SIM|Surat Izin Mengemudi
STNK|Surat Tanda Nomor Kendaraan
BPKB|Buku Pemilik Kendaraan Bermotor
NPWP|Nomor Pokok Wajib Pajak
NIK|Nomor Induk Kependudukan
KK|Kartu Keluarga
BPJS|Badan Penyelenggara Jaminan Sosial
DPR|Dewan Perwakilan Rakyat
DPD|Dewan Perwakilan Daerah
DPRD|Dewan Perwakilan Rakyat Daerah
MPR|Majelis Permusyawaratan Rakyat
MK|Mahkamah Konstitusi
MA|Mahkamah Agung
KPK|Komisi Pemberantasan Korupsi
KPU|Komisi Pemilihan Umum
OJK|Otoritas Jasa Keuangan
BI|Bank Indonesia
BNI|Bank Negara Indonesia
BRI|Bank Rakyat Indonesia
BCA|Bank Central Asia
UMKM|Usaha Mikro, Kecil, dan Menengah
UMR|Upah Minimum Regional
UMP|Upah Minimum Provinsi
UMK|Upah Minimum Kabupaten/Kota
THR|Tunjangan Hari Raya
PHK|Pemutusan Hubungan Kerja
PNS|Pegawai Negeri Sipil
ASN|Aparatur Sipil Negara
CPNS|Calon Pegawai Negeri Sipil
PPPK|Pegawai Pemerintah dengan Perjanjian Kerja
RT|Rukun Tetangga
RW|Rukun Warga
SD|Sekolah Dasar
SMP|Sekolah Menengah Pertama
SMA|Sekolah Menengah Atas
SMK|Sekolah Menengah Kejuruan
PAUD|Pendidikan Anak Usia Dini
TK|Taman Kanak-Kanak
UI|Universitas Indonesia
UGM|Universitas Gadjah Mada
ITB|Institut Teknologi Bandung
IPB|Institut Pertanian Bogor
ITS|Institut Teknologi Sepuluh Nopember
UTBK|Ujian Tulis Berbasis Komputer
SNBP|Seleksi Nasional Berbasis Prestasi
SNBT|Seleksi Nasional Berbasis Tes
KKN|Kuliah Kerja Nyata
IPK|Indeks Prestasi Kumulatif
SKS|Satuan Kredit Semester
RS|Rumah Sakit
Puskesmas|Pusat Kesehatan Masyarakat
Posyandu|Pos Pelayanan Terpadu
IGD|Instalasi Gawat Darurat
PMI|Palang Merah Indonesia
BMKG|Badan Meteorologi, Klimatologi, dan Geofisika
BNPB|Badan Nasional Penanggulangan Bencana
Basarnas|Badan Nasional Pencarian dan Pertolongan
BRIN|Badan Riset dan Inovasi Nasional
PLN|Perusahaan Listrik Negara
PDAM|Perusahaan Daerah Air Minum
BBM|Bahan Bakar Minyak
SPBU|Stasiun Pengisian Bahan Bakar Umum
KRL|Kereta Rel Listrik
MRT|Moda Raya Terpadu
LRT|Lintas Rel Terpadu
PT|Perseroan Terbatas
CV|Commanditaire Vennootschap (persekutuan komanditer)
UD|Usaha Dagang
Tbk|Terbuka (perseroan terbuka)
PPN|Pajak Pertambahan Nilai
PPh|Pajak Penghasilan
PBB|Pajak Bumi dan Bangunan
SPT|Surat Pemberitahuan Tahunan
APBN|Anggaran Pendapatan dan Belanja Negara
APBD|Anggaran Pendapatan dan Belanja Daerah
PDB|Produk Domestik Bruto
PDRB|Produk Domestik Regional Bruto
BPS|Badan Pusat Statistik
HUT|Hari Ulang Tahun
WNI|Warga Negara Indonesia
WNA|Warga Negara Asing
NKRI|Negara Kesatuan Republik Indonesia
UUD|Undang-Undang Dasar
UU|Undang-Undang
PP|Peraturan Pemerintah
Perpres|Peraturan Presiden
Perda|Peraturan Daerah
Kapolri|Kepala Kepolisian Republik Indonesia
WIB|Waktu Indonesia Barat
WITA|Waktu Indonesia Tengah
WIT|Waktu Indonesia Timur
ATM|Anjungan Tunai Mandiri
QRIS|Quick Response Code Indonesian Standard
LPG|Liquefied Petroleum Gas (elpiji)
OTP|One-Time Password (kata sandi sekali pakai)
PIN|Personal Identification Number (nomor identifikasi pribadi)`
  .split('\n')
  .map((l) => {
    const i = l.indexOf('|')
    return { s: l.slice(0, i), k: l.slice(i + 1) }
  })
module.exports = { SINGKATAN }
