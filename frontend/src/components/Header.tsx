import { Link } from 'react-router-dom'

const navLinks = [
  { href: '#paket', label: 'Paket' },
  { href: '#keunggulan', label: 'Keunggulan' },
  { href: '#alur', label: 'Alur' },
  { href: '#faq', label: 'FAQ' },
  { href: '#kontak', label: 'Kontak' },
  { to: '/serambi', label: 'Serambi' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#2a2a2a] bg-ink text-white">
      <nav className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-6 py-3.5">
        <Link to="/" className="font-serif text-[26px] font-bold text-gold">
          Amanah{' '}
          <span className="font-sans text-[15px] font-medium text-white">
            Umrah &amp; Haji
          </span>
        </Link>
        <div className="flex flex-wrap items-center gap-[22px] text-[15px]">
          {navLinks.map((link) => {
            if (link.to) {
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-white hover:text-gold transition"
                >
                  {link.label}
                </Link>
              )
            }
            return (
              <a
                key={link.href}
                href={link.href}
                className="text-white hover:text-gold transition"
              >
                {link.label}
              </a>
            )
          })}
          <a
            href="#kontak"
            className="btn rounded-md bg-gold px-5 py-[11px] font-bold text-ink"
          >
            Konsultasi
          </a>
        </div>
      </nav>
    </header>
  )
}
