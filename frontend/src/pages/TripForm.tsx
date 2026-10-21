import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3000'

type Trip = {
  id: string
  nama_trip: string
  paket_id: string | null
  tanggal_pergi: string
  quota: number
  status: string
  deleted: number
}

type Paket = {
  id: string
  nama: string
  tipe: string
  durasi: number
  harga: number
  deleted: number
}

type Form = {
  nama_trip: string
  paket_id: string | null
  tanggal_pergi: string
  quota: number
  status: 'waiting' | 'departed' | 'canceled'
}

export default function TripForm() {
  const navigate = useNavigate()
  const { mode, uuid } = useParams<{ mode: string; uuid: string }>()
  const isBaru = mode === 'baru'
  const [form, setForm] = useState<Form>({
    nama_trip: '',
    paket_id: null,
    tanggal_pergi: '',
    quota: 0,
    status: 'waiting',
  })
  const [pakets, setPakets] = useState<Paket[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`${API_BASE}/paket`)
      .then((res) => res.json())
      .then((rows: Paket[]) => setPakets(rows.filter((p) => p.deleted === 0)))
      .catch(() => setError('Gagal memuat data paket'))

    if (!isBaru && uuid) {
      fetch(`${API_BASE}/trip/list`)
        .then((res) => res.json())
        .then((rows: Trip[]) => {
          const t = rows.find((r) => r.id === uuid)
          if (t) {
            setForm({
              nama_trip: t.nama_trip,
              paket_id: t.paket_id,
              tanggal_pergi: t.tanggal_pergi,
              quota: t.quota,
              status: t.status as Form['status'],
            })
          }
        })
        .catch(() => setError('Gagal memuat data jadwal'))
    }
  }, [isBaru, uuid])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        nama_trip: form.nama_trip,
        paket_id: form.paket_id,
        tanggal_pergi: form.tanggal_pergi,
        quota: Number(form.quota),
        status: form.status,
      }
      if (isBaru) {
        await fetch(`${API_BASE}/trip/baru`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        navigate('/trip')
      } else {
        await fetch(`${API_BASE}/trip/ganti`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: uuid }),
        })
        navigate('/trip')
      }
    } catch {
      setError(isBaru ? 'Gagal menambah jadwal perjalanan' : 'Gagal mengubah jadwal perjalanan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-ink min-h-screen text-white px-6 py-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-[40px] font-bold tracking-tight">
              Formulir<span className="text-gold"> Jadwal Perjalanan</span>
            </h1>
            <p className="mt-2 text-[#d8d8d8]">
              {isBaru ? 'Tambah jadwal keberangkatan baru.' : 'Ubah data jadwal perjalanan.'}
            </p>
          </div>
          <Link
            to="/trip"
            className="btn rounded-md border border-[#333] px-6 py-3 font-bold text-white"
          >
            Batal
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-[#5a1a1a] border border-[#8a2a2a] text-[#ffb3b3] text-sm">
            {error}
          </div>
        )}

        <div className="bg-ink-2 border border-[#333] rounded-xl p-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
            <div className="col-span-2">
              <label className="block mb-1.5 text-xs font-bold text-[#bbb] uppercase">
                Nama Jadwal
              </label>
              <input
                className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gold"
                value={form.nama_trip}
                onChange={(e) => setForm({ ...form, nama_trip: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-bold text-[#bbb] uppercase">
                Paket
              </label>
              <select
                className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gold"
                value={form.paket_id ?? ''}
                onChange={(e) =>
                  setForm({ ...form, paket_id: e.target.value || null })
                }
              >
                <option value="">-- Pilih Paket --</option>
                {pakets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama} ({p.tipe})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-bold text-[#bbb] uppercase">
                Tanggal Pergi
              </label>
              <input
                type="date"
                className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gold"
                value={form.tanggal_pergi}
                onChange={(e) => setForm({ ...form, tanggal_pergi: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-bold text-[#bbb] uppercase">
                Quota
              </label>
              <input
                type="number"
                className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gold"
                value={form.quota}
                onChange={(e) => setForm({ ...form, quota: Number(e.target.value) })}
                required
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block mb-1.5 text-xs font-bold text-[#bbb] uppercase">
                Status
              </label>
              <select
                className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gold"
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as Form['status'] })
                }
              >
                <option value="waiting">Waiting</option>
                <option value="departed">Berangkat</option>
                <option value="canceled">Dibatalkan</option>
              </select>
            </div>
            <div className="col-span-2 flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn rounded-md bg-gold px-8 py-3 font-bold text-ink disabled:opacity-60"
              >
                {loading ? 'Menyimpan...' : isBaru ? 'Simpan' : 'Update'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
