const features = [
  {
    title: 'Pembimbing Berpengalaman',
    desc: 'Muthawif yang memahami tata cara ibadah dan mendampingi setiap langkah.',
  },
  {
    title: 'Manasik Sebelum Berangkat',
    desc: 'Bekal ilmu dan persiapan agar jamaah tenang saat di Tanah Suci.',
  },
  {
    title: 'Harga Transparan',
    desc: 'Rincian fasilitas yang termasuk dan tidak termasuk dijelaskan sejak awal.',
  },
  {
    title: 'Pendampingan Penuh',
    desc: 'Dari pendaftaran, keberangkatan, hingga kepulangan, tim kami siap membantu.',
  },
]

export default function Features() {
  return (
    <section id="keunggulan" className="bg-white px-6 py-[88px]">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="mb-2 text-center font-serif text-[44px]">
          Mengapa Memilih <span className="text-gold-dark">Amanah</span>
        </h2>
        <p className="mb-12 text-center text-[#555]">
          Kenyamanan ibadah Anda adalah prioritas kami.
        </p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border border-[#e6e6e6] border-t-4 border-t-gold p-7"
            >
              <h3 className="mb-2 text-[19px] font-bold">{feature.title}</h3>
              <p className="m-0 text-[#555]">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
