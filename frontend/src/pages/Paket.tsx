import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3000'

type Paket = {
  id: string
  nama: string
  tipe: string
  durasi: number
  harga: number
  deleted: number
}

type Form = {
  id?: string
  nama: string
  tipe: 'haji' | 'umrah'
  durasi: number
  harga: number
}

export default function Paket() {
  const [data, setData] = useState<Paket[]>([])
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'tambah' | 'ubah'>('tambah')
  const [form, setForm] = useState<Form>({ nama: '', tipe: 'umrah', durasi: 14, harga: 0 })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const res = await fetch(`${API_BASE}/paket`)
      const rows: Paket[] = await res.json()
      setData(rows.filter((p) => p.deleted === 0))
    } catch {
      setError('Gagal memuat data paket')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const payload = {
      nama: form.nama,
      tipe: form.tipe,
      durasi: Number(form.durasi),
      harga: Number(form.harga),
    }
    try {
      if (mode === 'tambah') {
        await fetch(`${API_BASE}/paket/baru`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        await fetch(`${API_BASE}/paket/ubah`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: form.id }),
        })
      }
      setOpen(false)
      setForm({ nama: '', tipe: 'umrah', durasi: 14, harga: 0 })
      setMode('tambah')
      await fetchData()
    } catch {
      setError('Gagal menyimpan paket')
    }
  }

  async function handleHapus(id: string) {
    if (!confirm('Yakin hapus paket ini?')) return
    try {
      await fetch(`${API_BASE}/paket/hapus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      await fetchData()
    } catch {
      setError('Gagal menghapus paket')
    }
  }

  function handleUbah(p: Paket) {
    setForm({ id: p.id, nama: p.nama, tipe: p.tipe as Form['tipe'], durasi: p.durasi, harga: p.harga })
    setMode('ubah')
    setOpen(true)
  }

  return (
    <section className="bg-ink min-h-screen text-white px-6 py-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-[40px] font-bold tracking-tight">
              PAKET<span className="text-gold"> PERJALANAN</span>
            </h1>
            <p className="mt-2 text-[#d8d8d8]">Kelola data paket perjalanan umrah dan haji.</p>
          </div>
          <button
            onClick={() => {
              setForm({ nama: '', tipe: 'umrah', durasi: 14, harga: 0 })
              setMode('tambah')
              setOpen(true)
            }}
            className="btn rounded-md bg-gold px-6 py-3 font-bold text-ink"
          >
            +Paket
          </button>
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
                <th className="p-4 border-b border-[#333]">Nama</th>
                <th className="p-4 border-b border-[#333]">Tipe</th>
                <th className="p-4 border-b border-[#333]">Durasi</th>
                <th className="p-4 border-b border-[#333]">Harga</th>
                <th className="p-4 border-b border-[#333] text-right">Kontrol</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p) => (
                <tr
                  key={p.id}
                  className="bg-ink-2 border-b border-[#2a2a2a] hover:bg-[#1e1e1e] transition"
                >
                  <td className="p-4">{p.nama}</td>
                  <td className="p-4 text-xs uppercase tracking-wider text-gold">
                    {p.tipe}
                  </td>
                  <td className="p-4">{p.durasi} hari</td>
                  <td className="p-4">Rp {p.harga.toLocaleString('id-ID')}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleUbah(p)}
                      className="mr-2 text-[12px] underline text-gold hover:text-white"
                    >
                      Ubah
                    </button>
                    <button
                      onClick={() => handleHapus(p.id)}
                      className="text-[12px] underline text-[#ff7979] hover:text-white"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#bbb]">
                    Belum ada data paket.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {open && (
          <div className="mt-8 bg-ink-2 border border-[#333] rounded-xl p-6">
            <h2 className="mb-4 font-serif text-[24px] font-bold">
              {mode === 'tambah' ? 'Tambah Paket' : 'Ubah Paket'}
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4"
            >
              <div className="col-span-2">
                <label className="block mb-1.5 text-xs font-bold text-[#bbb] uppercase">
                  Nama Paket
                </label>
                <input
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gold"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-bold text-[#bbb] uppercase">
                  Tipe
                </label>
                <select
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gold"
                  value={form.tipe}
                  onChange={(e) =>
                    setForm({ ...form, tipe: e.target.value as Form['tipe'] })
                  }
                >
                  <option value="umrah">Umrah</option>
                  <option value="haji">Haji</option>
                </select>
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-bold text-[#bbb] uppercase">
                  Durasi (hari)
                </label>
                <input
                  type="number"
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gold"
                  value={form.durasi}
                  onChange={(e) => setForm({ ...form, durasi: Number(e.target.value) })}
                  required
                />
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-bold text-[#bbb] uppercase">
                  Harga
                </label>
                <input
                  type="number"
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gold"
                  value={form.harga}
                  onChange={(e) => setForm({ ...form, harga: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="col-span-2 flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  className="btn rounded-md bg-gold px-6 py-3 font-bold text-ink"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    setForm({ nama: '', tipe: 'umrah', durasi: 14, harga: 0 })
                    setMode('tambah')
                    setError('')
                  }}
                  className="btn rounded-md border border-[#333] px-6 py-3 font-bold text-white"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  )
}
