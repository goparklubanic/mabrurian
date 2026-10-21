import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3000'

type Invoice = {
  id: string
  nomor_pendaftaran: string
  tanggal: string
  nama_trip: string
  paket_nama: string | null
  harga: number | null
  tanggal_pergi: string
  jamaah_nama: string
  alamat: string
  nomor_hp: string
  payment_status: string
}

export default function Invoice() {
  const { uuid } = useParams<{ uuid: string }>()
  const [data, setData] = useState<Invoice | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (uuid) {
      fetch(`${API_BASE}/registration/invoice/${uuid}`)
        .then((res) => res.json())
        .then((row: Invoice) => setData(row))
        .catch(() => setError('Gagal memuat invoice'))
    }
  }, [uuid])

  function handlePrint() {
    window.print()
  }

  if (!data) {
    return (
      <section className="bg-ink min-h-screen text-white px-6 py-12">
        <div className="mx-auto max-w-[1200px]">
          {error && (
            <div className="p-3 rounded bg-[#5a1a1a] border border-[#8a2a2a] text-[#ffb3b3] text-sm">
              {error}
            </div>
          )}
          <div className="text-center pt-20 text-[#bbb]">Memuat invoice...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white min-h-screen text-[#111] px-6 py-12">
      <div className="mx-auto max-w-[720px]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <Link
            to="/registration"
            className="text-sm text-[#666] hover:text-gold"
          >
            &larr; Kembali ke Pendaftaran
          </Link>
          <button
            onClick={handlePrint}
            className="btn rounded-md border border-[#333] px-5 py-2 font-bold text-[#111]"
          >
            Cetak
          </button>
        </div>

        <div className="bg-ink p-8 rounded-xl text-white mb-8">
          <h1 className="font-serif text-[32px] font-bold text-gold">
            Invoice {data.nomor_pendaftaran}
          </h1>
          <p className="mt-2 text-[#d8d8d8]">Pendaftaran Trip Umrah / Haji</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between border-b border-[#2a2a2a] pb-2">
            <span className="text-[#666] text-sm">Tanggal Registrasi</span>
            <span className="text-[#111] font-mono">{data.tanggal}</span>
          </div>
          <div className="flex justify-between border-b border-[#2a2a2a] pb-2">
            <span className="text-[#666] text-sm">Nama Jamaah</span>
            <span className="text-[#111] font-bold">{data.jamaah_nama}</span>
          </div>
          <div className="flex justify-between border-b border-[#2a2a2a] pb-2">
            <span className="text-[#666] text-sm">Alamat</span>
            <span className="text-[#111]">{data.alamat}</span>
          </div>
          <div className="flex justify-between border-b border-[#2a2a2a] pb-2">
            <span className="text-[#666] text-sm">Nomor Telepon</span>
            <span className="text-[#111] font-mono">{data.nomor_hp}</span>
          </div>
          <div className="flex justify-between border-b border-[#2a2a2a] pb-2">
            <span className="text-[#666] text-sm">Nama Trip</span>
            <span className="text-[#111] font-bold">{data.nama_trip}</span>
          </div>
          <div className="flex justify-between border-b border-[#2a2a2a] pb-2">
            <span className="text-[#666] text-sm">Nama Paket</span>
            <span className="text-[#111]">{data.paket_nama ?? '-'}</span>
          </div>
          <div className="flex justify-between border-b border-[#2a2a2a] pb-2">
            <span className="text-[#666] text-sm">Tanggal Keberangkatan</span>
            <span className="text-[#111]">{data.tanggal_pergi}</span>
          </div>
          <div className="flex justify-between border-b border-[#2a2a2a] pb-2">
            <span className="text-[#666] text-sm">Harga Paket</span>
            <span className="text-[#111] font-mono">
              Rp {data.harga?.toLocaleString('id-ID') ?? '-'}
            </span>
          </div>
          <div className="flex justify-between border-b border-[#2a2a2a] pb-2">
            <span className="text-[#666] text-sm">Status Pembayaran</span>
            <span
              className={`text-[#111] font-bold ${
                data.payment_status === 'paid' ? 'text-green-600' : 'text-amber-500'
              }`}
            >
              {data.payment_status}
            </span>
          </div>
        </div>

        <div className="mt-8 border-t border-[#ddd] pt-6 text-right text-xs text-[#666]">
          Biro Umrah dan Haji Amanah &mdash; Invoice {data.nomor_pendaftaran}
        </div>
      </div>
    </section>
  )
}
