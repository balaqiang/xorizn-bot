// Data negara: nama (id) | nama (en) | ibukota | mata uang | kode telepon | benua
const NEGARA = `Indonesia|Indonesia|Jakarta|IDR (Rupiah)|62|Asia
Malaysia|Malaysia|Kuala Lumpur|MYR (Ringgit)|60|Asia
Singapura|Singapore|Singapura|SGD (Dolar Singapura)|65|Asia
Thailand|Thailand|Bangkok|THB (Baht)|66|Asia
Vietnam|Vietnam|Hanoi|VND (Dong)|84|Asia
Filipina|Philippines|Manila|PHP (Peso)|63|Asia
Brunei|Brunei|Bandar Seri Begawan|BND (Dolar Brunei)|673|Asia
Kamboja|Cambodia|Phnom Penh|KHR (Riel)|855|Asia
Laos|Laos|Vientiane|LAK (Kip)|856|Asia
Myanmar|Myanmar|Naypyidaw|MMK (Kyat)|95|Asia
Timor Leste|Timor-Leste|Dili|USD (Dolar AS)|670|Asia
Jepang|Japan|Tokyo|JPY (Yen)|81|Asia
Korea Selatan|South Korea|Seoul|KRW (Won)|82|Asia
Korea Utara|North Korea|Pyongyang|KPW (Won Korea Utara)|850|Asia
Tiongkok|China|Beijing|CNY (Yuan Renminbi)|86|Asia
Taiwan|Taiwan|Taipei|TWD (Dolar Taiwan Baru)|886|Asia
Mongolia|Mongolia|Ulaanbaatar|MNT (Tugrik)|976|Asia
India|India|New Delhi|INR (Rupee)|91|Asia
Pakistan|Pakistan|Islamabad|PKR (Rupee Pakistan)|92|Asia
Bangladesh|Bangladesh|Dhaka|BDT (Taka)|880|Asia
Sri Lanka|Sri Lanka|Sri Jayawardenepura Kotte|LKR (Rupee Sri Lanka)|94|Asia
Nepal|Nepal|Kathmandu|NPR (Rupee Nepal)|977|Asia
Afghanistan|Afghanistan|Kabul|AFN (Afghani)|93|Asia
Kazakhstan|Kazakhstan|Astana|KZT (Tenge)|7|Asia
Uzbekistan|Uzbekistan|Tashkent|UZS (Som)|998|Asia
Arab Saudi|Saudi Arabia|Riyadh|SAR (Riyal Saudi)|966|Asia
Uni Emirat Arab|United Arab Emirates|Abu Dhabi|AED (Dirham)|971|Asia
Qatar|Qatar|Doha|QAR (Riyal Qatar)|974|Asia
Kuwait|Kuwait|Kuwait City|KWD (Dinar Kuwait)|965|Asia
Bahrain|Bahrain|Manama|BHD (Dinar Bahrain)|973|Asia
Oman|Oman|Muscat|OMR (Riyal Oman)|968|Asia
Yaman|Yemen|Sanaa|YER (Riyal Yaman)|967|Asia
Irak|Iraq|Baghdad|IQD (Dinar Irak)|964|Asia
Iran|Iran|Teheran|IRR (Rial Iran)|98|Asia
Turki|Turkey|Ankara|TRY (Lira Turki)|90|Asia
Suriah|Syria|Damaskus|SYP (Pound Suriah)|963|Asia
Yordania|Jordan|Amman|JOD (Dinar Yordania)|962|Asia
Lebanon|Lebanon|Beirut|LBP (Pound Lebanon)|961|Asia
Inggris|United Kingdom|London|GBP (Pound Sterling)|44|Eropa
Irlandia|Ireland|Dublin|EUR (Euro)|353|Eropa
Prancis|France|Paris|EUR (Euro)|33|Eropa
Jerman|Germany|Berlin|EUR (Euro)|49|Eropa
Italia|Italy|Roma|EUR (Euro)|39|Eropa
Spanyol|Spain|Madrid|EUR (Euro)|34|Eropa
Portugal|Portugal|Lisboa|EUR (Euro)|351|Eropa
Belanda|Netherlands|Amsterdam|EUR (Euro)|31|Eropa
Belgia|Belgium|Brussel|EUR (Euro)|32|Eropa
Swiss|Switzerland|Bern|CHF (Franc Swiss)|41|Eropa
Austria|Austria|Wina|EUR (Euro)|43|Eropa
Swedia|Sweden|Stockholm|SEK (Krona Swedia)|46|Eropa
Norwegia|Norway|Oslo|NOK (Krone Norwegia)|47|Eropa
Denmark|Denmark|Kopenhagen|DKK (Krone Denmark)|45|Eropa
Finlandia|Finland|Helsinki|EUR (Euro)|358|Eropa
Polandia|Poland|Warsawa|PLN (Zloty)|48|Eropa
Ceko|Czechia|Praha|CZK (Koruna Ceko)|420|Eropa
Hungaria|Hungary|Budapest|HUF (Forint)|36|Eropa
Yunani|Greece|Athena|EUR (Euro)|30|Eropa
Rusia|Russia|Moskow|RUB (Rubel)|7|Eropa/Asia
Ukraina|Ukraine|Kyiv|UAH (Hryvnia)|380|Eropa
Rumania|Romania|Bukares|RON (Leu)|40|Eropa
Mesir|Egypt|Kairo|EGP (Pound Mesir)|20|Afrika
Afrika Selatan|South Africa|Pretoria|ZAR (Rand)|27|Afrika
Nigeria|Nigeria|Abuja|NGN (Naira)|234|Afrika
Kenya|Kenya|Nairobi|KES (Syiling Kenya)|254|Afrika
Ethiopia|Ethiopia|Addis Ababa|ETB (Birr)|251|Afrika
Maroko|Morocco|Rabat|MAD (Dirham Maroko)|212|Afrika
Aljazair|Algeria|Aljir|DZD (Dinar Aljazair)|213|Afrika
Tunisia|Tunisia|Tunis|TND (Dinar Tunisia)|216|Afrika
Ghana|Ghana|Accra|GHS (Cedi)|233|Afrika
Tanzania|Tanzania|Dodoma|TZS (Syiling Tanzania)|255|Afrika
Amerika Serikat|United States|Washington, D.C.|USD (Dolar AS)|1|Amerika Utara
Kanada|Canada|Ottawa|CAD (Dolar Kanada)|1|Amerika Utara
Meksiko|Mexico|Kota Meksiko|MXN (Peso Meksiko)|52|Amerika Utara
Kuba|Cuba|Havana|CUP (Peso Kuba)|53|Amerika Utara
Brasil|Brazil|Brasilia|BRL (Real)|55|Amerika Selatan
Argentina|Argentina|Buenos Aires|ARS (Peso Argentina)|54|Amerika Selatan
Cile|Chile|Santiago|CLP (Peso Cile)|56|Amerika Selatan
Kolombia|Colombia|Bogota|COP (Peso Kolombia)|57|Amerika Selatan
Peru|Peru|Lima|PEN (Sol)|51|Amerika Selatan
Venezuela|Venezuela|Caracas|VES (Bolivar)|58|Amerika Selatan
Australia|Australia|Canberra|AUD (Dolar Australia)|61|Oseania
Selandia Baru|New Zealand|Wellington|NZD (Dolar Selandia Baru)|64|Oseania
Papua Nugini|Papua New Guinea|Port Moresby|PGK (Kina)|675|Oseania
Fiji|Fiji|Suva|FJD (Dolar Fiji)|679|Oseania`
  .split('\n')
  .map((l) => {
    const [id, en, ibukota, uang, kode, benua] = l.split('|')
    return { id, en, ibukota, uang, kode, benua }
  })

module.exports = { NEGARA }
