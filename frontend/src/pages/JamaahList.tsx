import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3000'

type Jamaah = {
  id: string
  nama: string
  tg_lahir: string
  alamat: string
  nomor_hp: string
  status: string
  deleted: number
}

export default function JamaahList() {
  const [data, setData] = useState<Jamaah[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const res = await fetch(`${API_BASE}/jamaah/list`)
      const rows: Jamaah[] = await res.json()
      setData(rows.filter((j) => j.deleted === 0))
    } catch {
      setError('Gagal memuat data jamaah')
    }
  }

  async function handleHapus(id: string) {
    if (!confirm('Yakin menghapus jamaah ini?')) return
    try {
      await fetch(`${API_BASE}/jamaah/batal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      await fetchData()
    } catch {
      setError('Gagal menghapus jamaah')
    }
  }

  return (
    <section className="bg-ink min-h-screen text-white px-6 py-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-[40px] font-bold tracking-tight">
              Calon<span className="text-gold"> Jamaah Umrah / Haji</span>
            </h1>
            <p className="mt-2 text-[#d8d8d8]">
              Daftar calon jamaah layanan umrah dan haji.
            </p>
          </div>
          <Link
            to="/jamaah/blanko/baru/0"
            className="btn rounded-md bg-gold px-6 py-3 font-bold text-ink"
          >
            +Jamaah
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
                <th className="p-4 border-b border-[#333]">Alamat</th>
                <th className="p-4 border-b border-[#333] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((j, i) => (
                <tr
                  key={j.id}
                  className="bg-ink-2 border-b border-[#2a2a2a] hover:bg-[#1e1e1e] transition"
                >
                  <td className="p-4">{i + 1}</td>
                  <td className="p-4">{j.nama}</td>
                  <td className="p-4">{j.alamat}</td>
                  <td className="p-4 text-right">
                    <Link
                      to={`/jamaah/profil/${j.id}`}
                      className="mr-2 text-[12px] underline text-gold hover:text-white"
                    >
                      Profil
                    </Link>
                    <button
                      onClick={() => handleHapus(j.id)}
                      className="text-[12px] underline text-[#ff7979] hover:text-white"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[#bbb]">
                    Belum ada data jamaah.
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
