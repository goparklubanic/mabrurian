import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3000'

type Trip = {
  id: string
  nama_trip: string
  paket_nama: string | null
  tanggal_pergi: string
  quota: number
  status: string
  deleted: number
}

type Jamaah = {
  id: string
  nama: string
  alamat: string
  nomor_hp: string
  deleted: number
}

type Rombongan = {
  id: string
  nomor_pendaftaran: string
  tanggal: string
  jamaah_nama: string
  alamat: string
  nomor_hp: string
  payment_status: string
}

export default function Registration() {
  const navigate = useNavigate()
  const [trips, setTrips] = useState<Trip[]>([])
  const [jamaahs, setJamaahs] = useState<Jamaah[]>([])
  const [filter, setFilter] = useState('')
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [selectedJamaah, setSelectedJamaah] = useState<Jamaah | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<'unpaid' | 'paid'>('unpaid')
  const [error, setError] = useState('')
  const [rombongans, setRombongans] = useState<Rombongan[]>([])

  useEffect(() => {
    fetch(`${API_BASE}/trip/list`)
      .then((res) => res.json())
      .then((rows: Trip[]) => setTrips(rows.filter((t) => t.status === 'waiting' && t.deleted === 0)))
      .catch(() => setError('Gagal memuat jadwal perjalanan'))
    fetch(`${API_BASE}/jamaah/list`)
      .then((res) => res.json())
      .then((rows: Jamaah[]) => setJamaahs(rows.filter((j) => j.deleted === 0)))
      .catch(() => setError('Gagal memuat daftar jamaah'))
  }, [])

  useEffect(() => {
    if (!selectedTrip) {
      setRombongans([])
      return
    }
    fetch(`${API_BASE}/registration/list?trip_id=${selectedTrip.id}`)
      .then((res) => res.json())
      .then((rows: Rombongan[]) => setRombongans(rows))
      .catch(() => setError('Gagal memuat data rombongan'))
  }, [selectedTrip])

  const showJamaahList = filter.length >= 3
  const filteredJamaahs = jamaahs.filter((j) =>
    j.nama.toLowerCase().includes(filter.toLowerCase())
  )

  const tanggal = new Date().toISOString().split('T')[0]

  async function handleSetPaid(nomorPendaftaran: string, registrationId: string) {
    if (!confirm('Setel status pembayaran ke lunas?')) return
    try {
      await fetch(`${API_BASE}/registration/paid/${nomorPendaftaran}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registration_id: registrationId }),
      })
      if (selectedTrip) {
        fetch(`${API_BASE}/registration/list?trip_id=${selectedTrip.id}`)
          .then((res) => res.json())
          .then((rows: Rombongan[]) => setRombongans(rows))
      }
    } catch {
      setError('Gagal memperbarui status pembayaran')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!selectedTrip || !selectedJamaah) {
      setError('Pilih jadwal perjalanan dan jamaah terlebih dahulu')
      return
    }
    try {
      const res = await fetch(`${API_BASE}/rombongan/baru`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trip_id: selectedTrip.id,
          jamaah_id: selectedJamaah.id,
          tanggal,
          payment_status: paymentStatus,
        }),
      })
      const result = await res.json()
      navigate(`/registration/invoice/${result.id}`)
    } catch {
      setError('Gagal mendaftarkan rombongan')
    }
  }
  return (
    <section className="bg-ink min-h-screen text-white px-6 py-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col gap-6 mb-8">
          <h1 className="font-serif text-[40px] font-bold tracking-tight">
            Pendaftaran<span className="text-gold"> Trip Umrah / Haji</span>
          </h1>
          {error && (
            <div className="p-3 rounded bg-[#5a1a1a] border border-[#8a2a2a] text-[#ffb3b3] text-sm">
              {error}
            </div>
          )}
          <Link
            to="/serambi"
            className="btn rounded-md border border-[#333] px-6 py-3 font-bold text-white"
          >
            Serambi
          </Link>
        </div>

        {/* Sub judul: Jadwal Perjalanan */}
        <div className="mb-8">
          <h2 className="mb-3 text-xl font-bold text-gold">Jadwal Perjalanan</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-[#333]">
              <thead>
                <tr className="bg-ink-2 text-[#bbb] text-sm">
                  <th className="p-3 border-b border-[#333]">Pilih</th>
                  <th className="p-3 border-b border-[#333]">Nama Perjalanan</th>
                  <th className="p-3 border-b border-[#333]">Nama Paket</th>
                  <th className="p-3 border-b border-[#333]">Tanggal Keberangkatan</th>
                  <th className="p-3 border-b border-[#333]">Quota</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((t) => (
                  <tr
                    key={t.id}
                    className={`bg-ink-2 border-b border-[#2a2a2a] hover:bg-[#1e1e1e] transition ${
                      selectedTrip?.id === t.id ? 'ring-2 ring-gold' : ''
                    }`}
                  >
                    <td className="p-3">
                      <input
                        type="radio"
                        name="trip"
                        checked={selectedTrip?.id === t.id}
                        onChange={() => setSelectedTrip(t)}
                        className="text-gold"
                      />
                    </td>
                    <td className="p-3">{t.nama_trip}</td>
                    <td className="p-3">{t.paket_nama ?? '-'}</td>
                    <td className="p-3">{t.tanggal_pergi}</td>
                    <td className="p-3">{t.quota}</td>
                  </tr>
                ))}
                {trips.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-[#bbb]">
                      Tidak ada jadwal perjalanan status waiting.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sub judul: Daftar jamaah (tampilkan setelah input >= 3 karakter) */}
        <div className="mb-8">
          <h2 className="mb-3 text-xl font-bold text-gold">Daftar Jamaah</h2>
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="Cari nama jamaah (minimal 3 karakter)..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="flex-1 bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <button
              disabled={!selectedJamaah}
              onClick={() => {}}
              className="px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded text-[#bbb] cursor-not-allowed opacity-50"
            >
              Pilih
            </button>
          </div>
          {!showJamaahList && (
            <div className="p-4 text-center text-[#bbb] text-sm italic">
              Ketik minimal 3 karakter untuk mencari jamaah.
            </div>
          )}
          {showJamaahList && (
            <div className="max-h-[300px] overflow-y-auto border border-[#333] rounded bg-[#0a0a0a]">
              {filteredJamaahs.length === 0 ? (
                <div className="p-4 text-center text-[#bbb] text-sm">
                  Tidak ada jamaah ditemukan.
                </div>
              ) : (
                <ul>
                  {filteredJamaahs.map((j) => (
                    <li
                      key={j.id}
                      onClick={() => setSelectedJamaah(j)}
                      className={`p-3 border-b border-[#2a2a2a] cursor-pointer hover:bg-[#1a1a1a] ${selectedJamaah?.id === j.id ? 'bg-[#1a1a1a] ring-1 ring-gold' : ''}`}
                    >
                      <div className="font-bold">{j.nama}</div>
                      <div className="text-sm text-[#888]">{j.alamat}</div>
                      <div className="text-sm text-[#888]">{j.nomor_hp}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {selectedJamaah && (
            <div className="mt-3 flex items-center gap-2 text-green-400 text-sm font-bold">
              ✓ Terpilih: {selectedJamaah.nama}
            </div>
          )}
        </div>

        {/* Sub judul: Rombongan Perjalanan (registrasi sesuai trip yang dipilih) */}
        {selectedTrip && (
          <div className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-gold">
              Rombongan Perjalanan {selectedTrip.nama_trip}
            </h2>
            <div className="max-h-[300px] overflow-y-auto border border-[#333] rounded bg-[#0a0a0a] mb-4">
              {rombongans.length === 0 ? (
                <div className="p-4 text-center text-[#bbb] text-sm">
                  Belum ada pendaftaran untuk perjalanan ini.
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-ink-2 text-[#bbb] text-sm">
                      <th className="p-3 border-b border-[#333]">No</th>
                      <th className="p-3 border-b border-[#333]">Nomor Pendaftaran</th>
                      <th className="p-3 border-b border-[#333]">Nama Jamaah</th>
                      <th className="p-3 border-b border-[#333]">Tanggal</th>
                      <th className="p-3 border-b border-[#333]">Status Pembayaran</th>
                      <th className="p-3 border-b border-[#333] text-center">Pelunasan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rombongans.map((r, i) => (
                      <tr key={r.id} className="border-b border-[#2a2a2a]">
                        <td className="p-3">{i + 1}</td>
                        <td className="p-3 font-mono text-sm text-gold">
                          {r.nomor_pendaftaran}
                        </td>
                        <td className="p-3">{r.jamaah_nama}</td>
                        <td className="p-3">{r.tanggal}</td>
                        <td className="p-3 text-sm capitalize">{r.payment_status}</td>
                        <td className="p-3 text-center">
                          {r.payment_status === 'paid' ? (
                            <span className="text-xs text-green-400 font-bold">Lunas</span>
                          ) : (
                            <button
                              onClick={() =>
                                handleSetPaid(r.nomor_pendaftaran, r.id)
                              }
                              className="text-xs underline text-gold hover:text-white"
                            >
                              Set Lunas
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Sub judul: Pendaftaran (hidden form) */}
        {selectedTrip && selectedJamaah && (
          <form onSubmit={handleSubmit} className="bg-ink-2 border border-[#333] rounded-xl p-6">
            <h2 className="mb-4 text-xl font-bold text-gold">
              Rombongan Perjalanan {selectedTrip.nama_trip}
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-4">
              <div>
                <label className="block mb-1 text-xs font-bold text-[#bbb] uppercase">
                  Nama Trip
                </label>
                <div className="text-white">{selectedTrip.nama_trip}</div>
              </div>
              <div>
                <label className="block mb-1 text-xs font-bold text-[#bbb] uppercase">
                  Nama Paket
                </label>
                <div className="text-white">{selectedTrip.paket_nama ?? '-'}</div>
              </div>
              <div>
                <label className="block mb-1 text-xs font-bold text-[#bbb] uppercase">
                  Tanggal Keberangkatan
                </label>
                <div className="text-white">{selectedTrip.tanggal_pergi}</div>
              </div>
              <div>
                <label className="block mb-1 text-xs font-bold text-[#bbb] uppercase">
                  Nama Jamaah
                </label>
                <div className="text-white">{selectedJamaah.nama}</div>
              </div>
              <div>
                <label className="block mb-1 text-xs font-bold text-[#bbb] uppercase">
                  Alamat
                </label>
                <div className="text-white">{selectedJamaah.alamat}</div>
              </div>
              <div>
                <label className="block mb-1 text-xs font-bold text-[#bbb] uppercase">
                  Nomor Telepon
                </label>
                <div className="text-white">{selectedJamaah.nomor_hp}</div>
              </div>
              <div>
                <label className="block mb-1 text-xs font-bold text-[#bbb] uppercase">
                  Tanggal Pendaftaran
                </label>
                <div className="text-white">{tanggal}</div>
              </div>
              <div>
                <label className="block mb-1 text-xs font-bold text-[#bbb] uppercase">
                  Status Pembayaran
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) =>
                    setPaymentStatus(e.target.value as 'unpaid' | 'paid')
                  }
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>
            <input type="hidden" name="trip_id" />
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn rounded-md bg-gold px-8 py-3 font-bold text-ink"
              >
                Daftarkan Rombongan
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
