type Pkg = {
  label: string
  title: string
  price: string
  per: string
  items: string[]
  featured?: boolean
}

const packages: Pkg[] = [
  {
    label: 'UMROH',
    title: 'Paket Umroh 7 Hari',
    price: 'Rp 30.000.000',
    per: 'per jamaah',
    items: [
      'Durasi 7 hari',
      'Hotel Makkah & Madinah: [NAMA HOTEL]',
      'Maskapai: [NAMA MASKAPAI]',
      'Jadwal berangkat: [TANGGAL]',
    ],
  },
  {
    label: 'UMROH',
    title: 'Paket Umroh 14 Hari',
    price: 'Rp 37.500.000',
    per: 'per jamaah',
    items: [
      'Durasi 14 hari, lebih leluasa beribadah',
      'Hotel Makkah & Madinah: [NAMA HOTEL]',
      'Maskapai: [NAMA MASKAPAI]',
      'Jadwal berangkat: [TANGGAL]',
    ],
    featured: true,
  },
  {
    label: 'HAJI',
    title: 'Paket Haji',
    price: 'Rp 94.990.000',
    per: 'per jamaah',
    items: [
      'Pembimbing ibadah haji',
      'Akomodasi: [DETAIL AKOMODASI]',
      'Keberangkatan: [TAHUN/KUOTA]',
      'Fasilitas: [DETAIL FASILITAS]',
    ],
  },
]

export default function Packages() {
  return (
    <section id="paket" className="bg-ink px-6 py-[88px] text-white">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="mb-2 text-center font-serif text-[44px]">
          Pilihan <span className="text-gold">Paket</span>
        </h2>
        <p className="mb-12 text-center text-[#cfcfcf]">
          Pilih sesuai kebutuhan dan kesiapan Anda.
        </p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.title}
              className={`flex flex-col gap-3.5 rounded-xl bg-ink-2 p-8 ${
                pkg.featured
                  ? 'relative border-2 border-gold'
                  : 'border border-[#333]'
              }`}
            >
              {pkg.featured && (
                <div className="absolute -top-3.5 left-8 rounded-[20px] bg-gold px-3 py-1 text-xs font-bold text-ink">
                  PALING DIMINATI
                </div>
              )}
              <div className="text-[13px] font-bold tracking-[.14em] text-gold">
                {pkg.label}
              </div>
              <div className="font-serif text-[32px] font-bold">{pkg.title}</div>
              <div className="text-[34px] font-bold text-gold">{pkg.price}</div>
              <div className="text-sm text-[#bbb]">{pkg.per}</div>
              <ul className="m-0 list-disc pl-5 text-[#ddd]">
                {pkg.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a
                href="#kontak"
                className={`btn mt-auto rounded-md py-3.5 text-center font-bold ${
                  pkg.featured
                    ? 'bg-gold text-ink'
                    : 'border border-gold text-gold'
                }`}
              >
                Daftar Paket Ini
              </a>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-[#aaa]">
          Rincian fasilitas yang termasuk dan tidak termasuk harga akan
          dijelaskan lengkap saat konsultasi.
        </p>
      </div>
    </section>
  )
}
