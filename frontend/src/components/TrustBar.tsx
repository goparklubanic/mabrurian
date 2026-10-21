const items = [
  { title: 'Izin Resmi Kemenag', sub: 'PPIU No. [NOMOR SK]' },
  { title: 'PIHK Haji Khusus', sub: 'No. [NOMOR SK]' },
  { title: 'Berdiri Sejak [TAHUN]', sub: '[JUMLAH] jamaah diberangkatkan' },
  { title: 'Kantor Fisik', sub: '[ALAMAT], Banjarnegara' },
]

export default function TrustBar() {
  return (
    <section className="border-b border-cream-border bg-cream px-6 py-10">
      <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-7 text-center">
        {items.map((item) => (
          <div key={item.title} className="flex-[1_1_200px]">
            <div className="text-[17px] font-bold">{item.title}</div>
            <div className="text-sm text-[#555]">{item.sub}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
