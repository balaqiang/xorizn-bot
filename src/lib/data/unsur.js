// 118 unsur kimia: nomor atom, simbol, nama (id), massa atom relatif (Ar; [..] = nomor massa isotop paling stabil)
const RAW = `H Hidrogen 1.008|He Helium 4.0026|Li Litium 6.94|Be Berilium 9.0122|B Boron 10.81|C Karbon 12.011|N Nitrogen 14.007|O Oksigen 15.999|F Fluor 18.998|Ne Neon 20.180|Na Natrium 22.990|Mg Magnesium 24.305|Al Aluminium 26.982|Si Silikon 28.085|P Fosfor 30.974|S Belerang 32.06|Cl Klor 35.45|Ar Argon 39.948|K Kalium 39.098|Ca Kalsium 40.078|Sc Skandium 44.956|Ti Titanium 47.867|V Vanadium 50.942|Cr Kromium 51.996|Mn Mangan 54.938|Fe Besi 55.845|Co Kobalt 58.933|Ni Nikel 58.693|Cu Tembaga 63.546|Zn Seng 65.38|Ga Galium 69.723|Ge Germanium 72.630|As Arsen 74.922|Se Selenium 78.971|Br Brom 79.904|Kr Kripton 83.798|Rb Rubidium 85.468|Sr Stronsium 87.62|Y Itrium 88.906|Zr Zirkonium 91.224|Nb Niobium 92.906|Mo Molibdenum 95.95|Tc Teknesium [98]|Ru Rutenium 101.07|Rh Rodium 102.91|Pd Paladium 106.42|Ag Perak 107.87|Cd Kadmium 112.41|In Indium 114.82|Sn Timah 118.71|Sb Antimon 121.76|Te Telurium 127.60|I Iodin 126.90|Xe Xenon 131.29|Cs Sesium 132.91|Ba Barium 137.33|La Lantanum 138.91|Ce Serium 140.12|Pr Praseodimium 140.91|Nd Neodimium 144.24|Pm Prometium [145]|Sm Samarium 150.36|Eu Europium 151.96|Gd Gadolinium 157.25|Tb Terbium 158.93|Dy Disprosium 162.50|Ho Holmium 164.93|Er Erbium 167.26|Tm Tulium 168.93|Yb Iterbium 173.05|Lu Lutesium 174.97|Hf Hafnium 178.49|Ta Tantalum 180.95|W Wolfram 183.84|Re Renium 186.21|Os Osmium 190.23|Ir Iridium 192.22|Pt Platina 195.08|Au Emas 196.97|Hg Raksa 200.59|Tl Talium 204.38|Pb Timbal 207.2|Bi Bismut 208.98|Po Polonium [209]|At Astatin [210]|Rn Radon [222]|Fr Fransium [223]|Ra Radium [226]|Ac Aktinium [227]|Th Torium 232.04|Pa Protaktinium 231.04|U Uranium 238.03|Np Neptunium [237]|Pu Plutonium [244]|Am Amerisium [243]|Cm Kurium [247]|Bk Berkelium [247]|Cf Kalifornium [251]|Es Einsteinium [252]|Fm Fermium [257]|Md Mendelevium [258]|No Nobelium [259]|Lr Lawrensium [266]|Rf Rutherfordium [267]|Db Dubnium [268]|Sg Seaborgium [269]|Bh Bohrium [270]|Hs Hasium [277]|Mt Meitnerium [278]|Ds Darmstadtium [281]|Rg Roentgenium [282]|Cn Kopernikium [285]|Nh Nihonium [286]|Fl Flerovium [289]|Mc Moskovium [290]|Lv Livermorium [293]|Ts Tenesin [294]|Og Oganeson [294]`
const UNSUR = RAW.split('|').map((s, i) => {
  const [simbol, nama, ar] = s.split(' ')
  return { no: i + 1, simbol, nama, ar }
})
// golongan kasar berdasarkan nomor atom
const GOLONGAN = (n) =>
  [2, 10, 18, 36, 54, 86, 118].includes(n) ? 'Gas mulia'
  : [3, 11, 19, 37, 55, 87].includes(n) ? 'Logam alkali'
  : [4, 12, 20, 38, 56, 88].includes(n) ? 'Logam alkali tanah'
  : [9, 17, 35, 53, 85, 117].includes(n) ? 'Halogen'
  : (n >= 57 && n <= 71) ? 'Lantanida'
  : (n >= 89 && n <= 103) ? 'Aktinida'
  : [1, 6, 7, 8, 15, 16, 34].includes(n) ? 'Nonlogam'
  : [5, 14, 32, 33, 51, 52].includes(n) ? 'Metaloid'
  : [13, 31, 49, 50, 81, 82, 83, 84, 113, 114, 115, 116].includes(n) ? 'Logam pasca-transisi'
  : 'Logam transisi'
module.exports = { UNSUR, GOLONGAN }
