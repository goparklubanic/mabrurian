import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3000'

type Trip = {
  id: string
  nama_trip: string
  paket_id: string | null
  tanggal_pergi: string
  quota: number
  status: string
  deleted: number
  paket_nama?: string | null
}

export default function TripList() {
  const [data, setData] = useState<Trip[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const res = await fetch(`${API_BASE}/trip/list`)
      const rows: Trip[] = await res.json()
      setData(rows.filter((t) => t.deleted === 0))
    } catch {
      setError('Gagal memuat data jadwal perjalanan')
    }
  }

  async function handleHapus(id: string) {
    if (!confirm('Yakin menghapus jadwal perjalanan ini?')) return
    try {
      await fetch(`${API_BASE}/trip/batal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      await fetchData()
    } catch {
      setError('Gagal menghapus jadwal perjalanan')
    }
  }

  return (
    <section className="bg-ink min-h-screen text-white px-6 py-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-[40px] font-bold tracking-tight">
              Jadwal<span className="text-gold"> Perjalanan</span>
            </h1>
            <p className="mt-2 text-[#d8d8d8]">
              Daftar jadwal keberangkatan umrah dan haji (status waiting).
            </p>
          </div>
          <Link
            to="/trip/blanko/baru/0"
            className="btn rounded-md bg-gold px-6 py-3 font-bold text-ink"
          >
            +Jadwal
          </Link>
          <Link
            to="/serambi"
            className="btn rounded-md border border-[#333] px-6 py-3 font-bold text-white"
          >
            Serambi
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-[#5a1a1a] border border-[#8a2a2a] text-[#ffb3b3] text-sm">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-[#333]">
            <thead>
              <tr className="bg-ink-2 text-[#bbb] text-sm">
                <th className="p-4 border-b border-[#333]">Nomor Urut</th>
                <th className="p-4 border-b border-[#333]">Nama</th>
                <th className="p-4 border-b border-[#333]">Tanggal Pergi</th>
                <th className="p-4 border-b border-[#333]">Quota</th>
                <th className="p-4 border-b border-[#333]">Status</th>
                <th className="p-4 border-b border-[#333] text-right">Kontrol</th>
              </tr>
            </thead>
            <tbody>
              {data.map((t, i) => (
                <tr
                  key={t.id}
                  className="bg-ink-2 border-b border-[#2a2a2a] hover:bg-[#1e1e1e] transition"
                >
                  <td className="p-4">{i + 1}</td>
                  <td className="p-4">{t.nama_trip}</td>
                  <td className="p-4">{t.tanggal_pergi}</td>
                  <td className="p-4">{t.quota}</td>
                  <td className="p-4 text-gold font-bold capitalize text-sm">
                    {t.status}
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      to={`/trip/blanko/ganti/${t.id}`}
                      className="mr-2 text-[12px] underline text-gold hover:text-white"
                    >
                      Update
                    </Link>
                    <button
                      onClick={() => handleHapus(t.id)}
                      className="text-[12px] underline text-[#ff7979] hover:text-white"
                    >
                      Batal
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#bbb]">
                    Belum ada data jadwal perjalanan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
