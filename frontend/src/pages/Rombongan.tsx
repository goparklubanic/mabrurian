import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { hmacFetch } from '../lib/hmac'

type Trip = {
  id: string
  nama_trip: string
  paket_nama: string | null
  tanggal_pergi: string
  quota: number
  status: string
  deleted: number
}

type Registration = {
  id: string
  nomor_pendaftaran: string
  tanggal: string
  jamaah_nama: string
  alamat: string
  nomor_hp: string
  payment_status: string
}

export default function Rombongan() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [regs, setRegs] = useState<Registration[]>([])
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null)
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [error, setError] = useState('')

  useEffect(() => {
    hmacFetch('GET', '/trip/list')
      .then((res) => res.json())
      .then((rows: Trip[]) => setTrips(rows.filter((t) => t.status === 'waiting' && t.deleted === 0)))
      .catch(() => setError('Gagal memuat jadwal perjalanan'))
  }, [])

  useEffect(() => {
    if (!selectedTripId) {
      setRegs([])
      return
    }
    hmacFetch('GET', `/registration/list?trip_id=${selectedTripId}`)
      .then((res) => res.json())
      .then((rows: Registration[]) => setRegs(rows.filter((r) => r.payment_status === 'paid')))
      .catch(() => setError('Gagal memuat data rombongan'))
  }, [selectedTripId])

  const selectedTrip = trips.find((t) => t.id === selectedTripId)
  const jumlahPeserta = regs.length

  const toggleCheck = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (checked.size === regs.length && regs.length > 0) {
      setChecked(new Set())
    } else {
      setChecked(new Set(regs.map((r) => r.id)))
    }
  }

  async function handleBatal() {
    const ids = Array.from(checked)
    if (ids.length === 0) {
      setError('Pilih minimal satu pendaftaran untuk dibatalkan')
      return
    }
    if (!confirm(`Yakin membatalkan ${ids.length} pendaftaran?`)) return
    try {
      await hmacFetch('POST', '/rombongan/batal', { ids })
      setChecked(new Set())
      if (selectedTripId) {
        hmacFetch('GET', `/registration/list?trip_id=${selectedTripId}`)
          .then((res) => res.json())
          .then((rows: Registration[]) => setRegs(rows.filter((r) => r.payment_status === 'paid')))
      }
    } catch {
      setError('Gagal membatalkan pendaftaran')
    }
  }

  return (
    <section className="bg-ink min-h-screen text-white px-6 py-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col gap-4 mb-8">
          <h1 className="font-serif text-[40px] font-bold tracking-tight">
            Daftar<span className="text-gold"> Rombongan Perjalanan</span>
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

        <div className="mb-6">
          <label className="block mb-2 text-xs font-bold text-[#bbb] uppercase">
            Filter Jadwal Perjalanan (Waiting)
          </label>
          <select
            value={selectedTripId ?? ''}
            onChange={(e) => setSelectedTripId(e.target.value || null)}
            className="w-full max-w-[320px] bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <option value="">-- Pilih Jadwal --</option>
            {trips.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nama_trip} - {t.tanggal_pergi}
              </option>
            ))}
          </select>
        </div>

        {selectedTrip && (
          <div className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-gold">Data Perjalanan</h2>
            <div className="bg-ink-2 border border-[#333] rounded-xl p-6">
              <table className="w-full text-left border-collapse">
                <tbody>
                  <tr className="border-b border-[#2a2a2a]">
                    <td className="p-3 text-[#bbb] text-xs font-bold uppercase w-1/4">Nama Trip</td>
                    <td className="p-3 text-white">{selectedTrip.nama_trip}</td>
                  </tr>
                  <tr className="border-b border-[#2a2a2a]">
                    <td className="p-3 text-[#bbb] text-xs font-bold uppercase">Nama Paket</td>
                    <td className="p-3 text-white">{selectedTrip.paket_nama ?? '-'}</td>
                  </tr>
                  <tr className="border-b border-[#2a2a2a]">
                    <td className="p-3 text-[#bbb] text-xs font-bold uppercase">Tanggal Keberangkatan</td>
                    <td className="p-3 text-white">{selectedTrip.tanggal_pergi}</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-[#bbb] text-xs font-bold uppercase">Jumlah Peserta</td>
                    <td className="p-3 text-white font-bold">{jumlahPeserta}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div>
          <h2 className="mb-3 text-xl font-bold text-gold">Data Rombongan</h2>
          <div className="bg-ink-2 border border-[#333] rounded-xl p-6 overflow-x-auto">
            <table className="w-full text-left border-collapse border border-[#333]">
              <thead>
                <tr className="bg-ink-2 text-[#bbb] text-sm">
                  <th className="p-3 border-b border-[#333] w-10 text-center">
                    {regs.length > 0 ? (
                      <input
                        type="checkbox"
                        checked={checked.size === regs.length}
                        onChange={toggleAll}
                        className="text-gold"
                      />
                    ) : null}
                  </th>
                  <th className="p-3 border-b border-[#333]">Nomor Urut</th>
                  <th className="p-3 border-b border-[#333]">Nama Jamaah</th>
                  <th className="p-3 border-b border-[#333]">Alamat Jamaah</th>
                  <th className="p-3 border-b border-[#333]">Nomor Telepon</th>
                  <th className="p-3 border-b border-[#333] text-center">Kontrol</th>
                </tr>
              </thead>
              <tbody>
                {regs.map((r, i) => (
                  <tr
                    key={r.id}
                    className="bg-ink-2 border-b border-[#2a2a2a] hover:bg-[#1e1e1e] transition"
                  >
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={checked.has(r.id)}
                        onChange={() => toggleCheck(r.id)}
                        className="text-gold"
                      />
                    </td>
                    <td className="p-3">{i + 1}</td>
                    <td className="p-3">{r.jamaah_nama}</td>
                    <td className="p-3">{r.alamat}</td>
                    <td className="p-3 font-mono text-sm">{r.nomor_hp}</td>
                    <td className="p-3 text-center">
                      <span className="text-xs font-mono text-gold">{r.nomor_pendaftaran}</span>
                    </td>
                  </tr>
                ))}
                {regs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-[#bbb]">
                      Pilih jadwal perjalanan untuk melihat data rombongan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {regs.length > 0 && (
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleBatal}
                disabled={checked.size === 0}
                className={`btn rounded-md border border-[#ff7979] px-5 py-2 font-bold text-[#ff7979] ${
                  checked.size === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Batal ({checked.size})
              </button>
              <Link
                to="/registration"
                className="btn rounded-md border border-[#333] px-5 py-2 font-bold text-white"
              >
                Pendaftaran Baru
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
