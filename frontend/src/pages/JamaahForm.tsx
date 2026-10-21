import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3000'

type Form = {
  nama: string
  tg_lahir: string
  alamat: string
  nomor_hp: string
  status: 'prospect' | 'registered'
}

export default function JamaahForm() {
  const navigate = useNavigate()
  const { mode, uuid } = useParams<{ mode: string; uuid: string }>()
  const isBaru = mode === 'baru'
  const [form, setForm] = useState<Form>({
    nama: '',
    tg_lahir: '',
    alamat: '',
    nomor_hp: '',
    status: 'prospect',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isBaru && uuid) {
      fetch(`${API_BASE}/jamaah/info?uuid=${uuid}`)
        .then((res) => res.json())
        .then((row: any) => {
          setForm({
            nama: row.nama ?? '',
            tg_lahir: row.tg_lahir ?? '',
            alamat: row.alamat ?? '',
            nomor_hp: row.nomor_hp ?? '',
            status: row.status === 'registered' ? 'registered' : 'prospect',
          })
        })
        .catch(() => setError('Gagal memuat data jamaah'))
    }
  }, [isBaru, uuid])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        nama: form.nama,
        tg_lahir: form.tg_lahir,
        alamat: form.alamat,
        nomor_hp: form.nomor_hp,
        status: form.status,
      }
      if (isBaru) {
        await fetch(`${API_BASE}/jamaah/baru`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        navigate('/jamaah')
      } else {
        await fetch(`${API_BASE}/jamaah/ganti`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: uuid }),
        })
        navigate(`/jamaah/profil/${uuid}`)
      }
    } catch {
      setError(isBaru ? 'Gagal menambah jamaah' : 'Gagal mengubah jamaah')
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
              Formulir<span className="text-gold"> Jamaah</span>
            </h1>
            <p className="mt-2 text-[#d8d8d8]">
              {isBaru ? 'Tambah data calon jamaah baru.' : 'Ubah data jamaah.'}
            </p>
          </div>
          <Link
            to="/jamaah"
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
            <div>
              <label className="block mb-1.5 text-xs font-bold text-[#bbb] uppercase">
                Nama Lengkap
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
                Tanggal Lahir
              </label>
              <input
                type="date"
                className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gold"
                value={form.tg_lahir}
                onChange={(e) => setForm({ ...form, tg_lahir: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-bold text-[#bbb] uppercase">
                Alamat
              </label>
              <input
                className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gold"
                value={form.alamat}
                onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-bold text-[#bbb] uppercase">
                Nomor HP
              </label>
              <input
                className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gold"
                value={form.nomor_hp}
                onChange={(e) => setForm({ ...form, nomor_hp: e.target.value })}
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
                <option value="prospect">Prospect</option>
                <option value="registered">Registered</option>
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
