const steps = [
  { n: 1, title: 'Konsultasi', desc: 'Diskusi paket dan jadwal' },
  { n: 2, title: 'Pilih Paket', desc: 'Sesuaikan kebutuhan Anda' },
  { n: 3, title: 'Bayar DP', desc: 'Ke rekening resmi perusahaan' },
  { n: 4, title: 'Lengkapi Dokumen', desc: 'Paspor, KTP, KK, buku nikah' },
  { n: 5, title: 'Manasik & Berangkat', desc: 'Siap menuju Tanah Suci' },
]

export default function Flow() {
  return (
    <section id="alur" className="bg-cream px-6 py-[88px]">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="mb-12 text-center font-serif text-[44px]">
          Alur Pendaftaran
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
          {steps.map((step) => (
            <div key={step.n} className="text-center">
              <div className="mx-auto mb-3 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-ink text-xl font-bold text-gold">
                {step.n}
              </div>
              <b>{step.title}</b>
              <div className="text-sm text-[#555]">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
