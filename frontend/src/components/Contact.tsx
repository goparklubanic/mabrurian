export default function Contact() {
  return (
    <section id="kontak" className="bg-ink px-6 py-[88px] text-white">
      <div className="mx-auto max-w-[1000px] text-center">
        <h2 className="mb-3 font-serif text-[48px]">
          Mulai Perjalanan <span className="text-gold">Ibadah</span> Anda
        </h2>
        <p className="mb-8 text-[#d0d0d0]">
          Konsultasi gratis, tanpa kewajiban mendaftar.
        </p>
        <a
          href="#kontak"
          className="btn inline-block rounded-md bg-gold px-9 py-[18px] text-[17px] font-bold text-ink"
        >
          Chat WhatsApp: [NOMOR WHATSAPP]
        </a>
        <div className="mt-10 flex flex-wrap justify-center gap-7 text-[15px] text-[#bbb]">
          <span>[ALAMAT KANTOR], Banjarnegara</span>
          <span>Telepon: [NOMOR TELEPON]</span>
          <span>Senin–Sabtu, [JAM OPERASIONAL]</span>
        </div>
      </div>
    </section>
  )
}
