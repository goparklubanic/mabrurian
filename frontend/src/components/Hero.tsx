import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="bg-ink px-6 pt-24 pb-[104px] text-white">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-12">
        <div className="flex-[1_1_480px]">
          <div className="text-[13px] font-bold tracking-[.18em] text-gold uppercase">
            Banjarnegara · Jawa Tengah
          </div>
          <h1 className="mt-[18px] mb-5 font-serif text-[64px] leading-[1.05] font-bold">
            Perjalanan Ibadah yang Nyaman,{' '}
            <span className="text-gold">Amanah</span>, dan Terbimbing
          </h1>
          <p className="mb-8 max-w-[560px] text-lg text-[#d8d8d8]">
            Kami mendampingi Anda dari persiapan manasik hingga kembali ke tanah
            air, dengan layanan jujur dan transparan.
          </p>
          <div className="flex flex-wrap gap-3.5">
            <a
              href="#kontak"
              className="btn rounded-md bg-gold px-7 py-4 font-bold text-ink"
            >
              Konsultasi via WhatsApp
            </a>
            <Link
              to="/paket"
              className="btn rounded-md border border-gold px-7 py-4 font-bold text-gold"
            >
              Lihat Paket
            </Link>
          </div>
        </div>

        <div className="flex min-h-[340px] flex-[1_1_320px] items-center justify-center rounded-xl border border-gold bg-ink-2 p-6 text-center text-gold">
          <div>
            <svg
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d4af37"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <rect x="5" y="8" width="14" height="13" />
              <path d="M5 12h14M9 8V5l3-2 3 2v3" />
            </svg>
            <div className="mt-3 text-sm">
              [FOTO ASLI: Ka'bah atau jamaah Amanah]
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
