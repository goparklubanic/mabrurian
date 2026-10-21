const faqs = [
  {
    q: 'Apakah paspor harus sudah dimiliki?',
    a: 'Sebaiknya sudah ada, namun tim kami dapat membantu pengurusannya.',
  },
  {
    q: 'Apakah tersedia layanan untuk lansia?',
    a: 'Ya, silakan sampaikan kebutuhan Anda saat konsultasi agar dapat kami siapkan.',
  },
  {
    q: 'Bisakah berangkat bersama keluarga?',
    a: 'Bisa. Kami membantu mengatur keberangkatan bersama keluarga atau mahram.',
  },
  {
    q: 'Bagaimana kebijakan pembatalan?',
    a: '[KEBIJAKAN PEMBATALAN DAN REFUND] dijelaskan jelas sebelum pembayaran.',
  },
]

export default function Faq() {
  return (
    <section id="faq" className="bg-white px-6 py-[88px]">
      <div className="mx-auto max-w-[820px]">
        <h2 className="mb-8 text-center font-serif text-[44px]">
          Pertanyaan Umum
        </h2>
        {faqs.map((faq) => (
          <div key={faq.q} className="border-b border-[#e6e6e6] py-[18px]">
            <b>{faq.q}</b>
            <div className="text-[#555]">{faq.a}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
