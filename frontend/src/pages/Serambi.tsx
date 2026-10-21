import { Link } from 'react-router-dom'

type Card = {
  to: string
  title: string
  subtitle: string
  icon: string
}

const cards: Card[] = [
  {
    to: '/paket',
    title: 'Paket Perjalanan',
    subtitle: 'Kelola data paket umrah dan haji',
    icon: 'P',
  },
  {
    to: '/trip',
    title: 'Jadwal Perjalanan',
    subtitle: 'Kelola jadwal keberangkatan dan quota',
    icon: 'J',
  },
  {
    to: '/jamaah',
    title: 'Data Jamaah',
    subtitle: 'Kelola data calon jamaah',
    icon: 'J',
  },
  {
    to: '/registration',
    title: 'Pendaftaran',
    subtitle: 'Daftarkan rombongan jamaah ke perjalanan',
    icon: 'R',
  },
  {
    to: '/rombongan',
    title: 'Data Rombongan',
    subtitle: 'Kelola daftar peserta rombongan perjalanan',
    icon: 'R',
  },
]

export default function Serambi() {
  return (
    <section className="bg-ink min-h-screen text-white px-6 py-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="font-serif text-[48px] font-bold tracking-tight">
              Serambi<span className="text-gold"> Biro</span>
            </h1>
            <p className="mt-2 text-[#d8d8d8]">
              Dashboard manajemen data paket, jadwal, jamaah, pendaftaran dan
              rombongan perjalanan umrah / haji.
            </p>
          </div>
          <Link
            to="/"
            className="btn rounded-md border border-[#333] px-6 py-3 font-bold text-white"
          >
            Kembali ke Beranda
          </Link>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          {cards.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="bg-ink-2 border border-[#333] rounded-xl p-8 hover:border-gold hover:bg-[#141414] transition group"
            >
              <div className="w-12 h-12 rounded-lg bg-gold text-ink flex items-center justify-center font-serif text-[30px] font-bold mb-4 group-hover:scale-110 transition">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <p className="text-[#bbb] text-sm">{card.subtitle}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
