import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3000'
const AVATAR_URL =
  'https://static.vecteezy.com/system/resources/thumbnails/081/816/457/small/a-black-and-white-drawing-of-a-woman-wearing-a-hijab-vector.jpg'

type Jamaah = {
  id: string
  nama: string
  tg_lahir: string
  alamat: string
  nomor_hp: string
  status: string
  deleted: number
}

export default function JamaahProfil() {
  const navigate = useNavigate()
  const { uuid } = useParams<{ uuid: string }>()
  const [data, setData] = useState<Jamaah | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (uuid) fetchData()
  }, [uuid])

  async function fetchData() {
    try {
      const res = await fetch(`${API_BASE}/jamaah/info?uuid=${uuid}`)
      const row: Jamaah = await res.json()
      setData(row)
    } catch {
      setError('Gagal memuat profil jamaah')
    }
  }

  async function handleHapus() {
    if (!uuid || !confirm('Yakin menghapus jamaah ini?')) return
    try {
      await fetch(`${API_BASE}/jamaah/batal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: uuid }),
      })
      navigate('/jamaah')
    } catch {
      setError('Gagal menghapus jamaah')
    }
  }

  if (!data) {
    return (
      <section className="bg-ink min-h-screen text-white px-6 py-12">
        <div className="mx-auto max-w-[1200px]">
          {error && (
            <div className="mb-4 p-3 rounded bg-[#5a1a1a] border border-[#8a2a2a] text-[#ffb3b3] text-sm">
              {error}
            </div>
          )}
          <div className="text-center pt-20 text-[#bbb]">Memuat profil...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-ink min-h-screen text-white px-6 py-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-[40px] font-bold tracking-tight">
              Profil<span className="text-gold"> Jamaah</span>
            </h1>
            <Link
              to="/jamaah"
              className="mt-2 inline-block text-sm text-[#d8d8d8] hover:text-gold"
            >
              &larr; Kembali ke Daftar Jamaah
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-[#5a1a1a] border border-[#8a2a2a] text-[#ffb3b3] text-sm">
            {error}
          </div>
        )}

        <div className="max-w-[420px] mx-auto">
          <div className="bg-ink-2 border border-[#333] rounded-2xl overflow-hidden shadow-lg">
            {/* Bagian atas: foto jamaah (lebar 100% card, center aligned, latar putih) */}
            <div className="relative flex flex-col items-center bg-white w-full rounded-t-2xl overflow-hidden">
              <img
                src={AVATAR_URL}
                alt={`Foto ${data.nama}`}
                className="max-w-[300px] w-auto h-auto block mt-8"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = AVATAR_URL
                }}
              />
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border-4 border-gold bg-white"></div>
            </div>

            {/* Bagian tengah: data jamaah ditampilkan secara vertikal */}
            <div className="p-6 space-y-4">
              <h2 className="font-serif text-[24px] font-bold text-white">
                {data.nama}
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 border-b border-[#2a2a2a] pb-2 last:border-b-0 last:pb-0">
                  <dt className="w-20 text-[#bbb] text-xs font-bold uppercase leading-tight">
                    Tanggal Lahir
                  </dt>
                  <dd className="text-white leading-tight">{data.tg_lahir}</dd>
                </div>
                <div className="flex items-start gap-3 border-b border-[#2a2a2a] pb-2 last:border-b-0 last:pb-0">
                  <dt className="w-20 text-[#bbb] text-xs font-bold uppercase leading-tight">
                    Alamat
                  </dt>
                  <dd className="text-white leading-tight">{data.alamat}</dd>
                </div>
                <div className="flex items-start gap-3 border-b border-[#2a2a2a] pb-2 last:border-b-0 last:pb-0">
                  <dt className="w-20 text-[#bbb] text-xs font-bold uppercase leading-tight">
                    Nomor HP
                  </dt>
                  <dd className="text-white leading-tight">{data.nomor_hp}</dd>
                </div>
                <div className="flex items-start gap-3 last:border-b-0">
                  <dt className="w-20 text-[#bbb] text-xs font-bold uppercase leading-tight">
                    Status
                  </dt>
                  <dd className="text-gold font-bold capitalize leading-tight">
                    {data.status}
                  </dd>
                </div>
              </div>
            </div>

            {/* Bagian bawah: tombol update dan batal */}
            <div className="p-6 border-t border-[#2a2a2a] flex gap-3">
              <Link
                to={`/jamaah/blanko/ganti/${uuid}`}
                className="flex-1 btn rounded-md bg-gold py-3 font-bold text-ink text-center"
              >
                Update
              </Link>
              <button
                onClick={handleHapus}
                className="flex-1 btn rounded-md border border-[#ff7979] py-3 font-bold text-[#ff7979] text-center"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
