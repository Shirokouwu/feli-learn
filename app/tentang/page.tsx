"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Target, Mail, MapPin, Phone, GraduationCap, BookOpen, Heart, Shield, Leaf, Search, Database as DatabaseIcon, Scan, Layers, Eye, Ruler } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export default function TentangKami() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-16 px-4 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <Badge
                variant="secondary"
                className="mb-4 text-xs md:text-sm bg-emerald-300 text-black border-2 border-black uppercase tracking-wide rounded-none"
              >
                Tentang Felidae Learn
              </Badge>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4 text-neutral-900">
                Kenapa Aplikasi Ini Ada, dan Apa Manfaatnya?
              </h1>
              <p className="text-neutral-600 text-lg mb-6 leading-relaxed">
                Felidae Learn dibuat untuk memudahkan siapa pun memahami keanekaragaman keluarga Felidae (kucing liar)
                melalui database yang rapi, eksplorasi taksonomi interaktif, dan alat bantu belajar yang praktis.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-white border-2 border-black rounded-none shadow-[4px_4px_0_#111] hover:translate-x-[-2px] hover:translate-y-[-2px]">
                  <Link href="/database-explorer">Lihat Database</Link>
                </Button>
                <Button variant="outline" asChild className="bg-white border-2 border-black rounded-none shadow-[4px_4px_0_#111] hover:translate-x-[-2px] hover:translate-y-[-2px]">
                  <Link href="/radial">Eksplorasi Radial</Link>
                </Button>
                <Button variant="secondary" asChild className="bg-white border-2 border-black rounded-none shadow-[4px_4px_0_#111] hover:translate-x-[-2px] hover:translate-y-[-2px]">
                  <Link href="/scanner">Scanner AI</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-video rounded-none overflow-hidden border-2 border-black shadow-[8px_8px_0_#111]"
            >
              <Image
                src="https://images.unsplash.com/photo-1564349683136-77e08dba1ef3?q=80&w=2072&auto=format&fit=crop"
                alt="Konservasi Felidae"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-white font-medium">Belajar Taksonomi, Lebih Mudah</p>
                    <p className="text-green-200 text-sm">Eksplorasi interaktif • Data terstruktur</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <Badge
              variant="secondary"
              className="mb-4 text-xs md:text-sm bg-emerald-300 text-black border-2 border-black uppercase tracking-wide rounded-none"
            >
              Latar Belakang
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-neutral-900">Masalah yang Kami Selesaikan</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Informasi tentang Felidae tersebar, sulit dipelajari secara sistematis, dan sering kali tidak
              terhubung satu sama lain (habitat, perilaku, status konservasi, dan taksonomi). Felidae Learn menyatukan
              semuanya agar belajar jadi jelas dan menyenangkan.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-none p-6 border-2 border-black shadow-[6px_6px_0_#111]"
            >
              <div className="mb-3 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Shield className="h-5 w-5 text-green-700" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-neutral-900">Tantangan Umum</h3>
              <ul className="space-y-3 text-neutral-600 text-sm">
                <li>• Data spesies tercecer di banyak sumber, sulit ditelusuri.</li>
                <li>• Taksonomi membingungkan bagi pemula; hierarki tidak intuitif.</li>
                <li>• Sulit mengaitkan antara morfologi, perilaku, habitat, dan status konservasi.</li>
                <li>• Kurangnya alat bantu visual/AI untuk belajar cepat.</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-none p-6 border-2 border-black shadow-[6px_6px_0_#111]"
            >
              <div className="mb-3 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Target className="h-5 w-5 text-green-700" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-neutral-900">Solusi Felidae Learn</h3>
              <ul className="space-y-3 text-neutral-600 text-sm">
                <li>• Database terstruktur untuk genus dan spesies Felidae.</li>
                <li>• Eksplorasi taksonomi radial untuk melihat kekerabatan secara visual.</li>
                <li>• Ringkasan informasi per spesies: habitat, karakteristik, dan status konservasi.</li>
                <li>• Scanner AI untuk membantu belajar mengenali spesies dari gambar.</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What you can get */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <Badge
              variant="secondary"
              className="mb-4 text-xs md:text-sm bg-emerald-300 text-black border-2 border-black uppercase tracking-wide rounded-none"
            >
              Informasi yang Bisa Kamu Ambil
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-neutral-900">Apa Saja di Dalam Aplikasi?</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <DatabaseIcon className="h-6 w-6 text-green-700" />,
                title: "Profil Spesies",
                desc: "Nama ilmiah, nama umum, karakteristik ringkas, dan info dasar taksonomi.",
              },
              {
                icon: <Layers className="h-6 w-6 text-green-700" />,
                title: "Hierarki Taksonomi",
                desc: "Hubungan genus–spesies yang divisualisasikan secara interaktif.",
              },
              {
                icon: <Leaf className="h-6 w-6 text-green-700" />,
                title: "Habitat & Persebaran",
                desc: "Ringkasan habitat utama dan area sebaran (jika tersedia).",
              },
              {
                icon: <Shield className="h-6 w-6 text-green-700" />,
                title: "Status Konservasi",
                desc: "Penanda tingkat risiko (mis. rentan/terancam) sesuai rujukan database.",
              },
              {
                icon: <BookOpen className="h-6 w-6 text-green-700" />,
                title: "Catatan Edukatif",
                desc: "Penjelasan singkat untuk membantu belajar konsep-konsep kunci.",
              },
              {
                icon: <Search className="h-6 w-6 text-green-700" />,
                title: "Pencarian & Filter",
                desc: "Cari spesies berdasarkan nama, status, atau genus dengan cepat.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-white rounded-none p-5 border-2 border-black shadow-[6px_6px_0_#111] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-neutral-900">{item.title}</h3>
                <p className="text-neutral-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features & Why */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <Badge className="mb-4 text-xs md:text-sm bg-emerald-300 text-black border-2 border-black uppercase tracking-wide rounded-none">Fitur Utama & Alasannya</Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-neutral-900">Kenapa Fitur-fitur Ini Ada?</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Setiap fitur dirancang untuk menjawab masalah nyata saat mempelajari Felidae—dari dasar taksonomi
              sampai mengenali spesies secara visual.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <DatabaseIcon className="h-5 w-5 text-green-700" />,
                title: "Database Felidae",
                why: "Mengumpulkan data yang tercecer menjadi satu tempat yang mudah dijelajahi.",
                href: "/database-explorer",
                cta: "Buka Database",
              },
              {
                icon: <Layers className="h-5 w-5 text-green-700" />,
                title: "Eksplorasi Radial",
                why: "Memudahkan melihat kekerabatan genus–spesies secara visual.",
                href: "/radial",
                cta: "Lihat Visual",
              },
              {
                icon: <Scan className="h-5 w-5 text-green-700" />,
                title: "Scanner AI",
                why: "Membantu belajar dengan mencoba mengenali spesies dari gambar.",
                href: "/scanner",
                cta: "Coba Scanner",
              },
              {
                icon: <Users className="h-5 w-5 text-green-700" />,
                title: "Profile & Riwayat",
                why: "Menyimpan aktivitas dan mempersonalisasi pengalaman belajar.",
                href: "/profile",
                cta: "Buka Profil",
              },
              {
                icon: <BookOpen className="h-5 w-5 text-green-700" />,
                title: "Pembelajaran Terstruktur",
                why: "Menjembatani pemula ke konsep-konsep taksonomi secara bertahap.",
                href: "/learning",
                cta: "Mulai Belajar",
              },
              {
                icon: <Search className="h-5 w-5 text-green-700" />,
                title: "Pencarian & Filter",
                why: "Mempercepat menemukan spesies/genus yang diinginkan.",
                href: "/database-explorer",
                cta: "Cari Sekarang",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-white rounded-none p-5 border-2 border-black shadow-[6px_6px_0_#111] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
              >
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center mb-3">
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold mb-1 text-neutral-900">{f.title}</h3>
                <p className="text-neutral-600 text-sm mb-3">{f.why}</p>
                <Button asChild size="sm" variant="outline" className="bg-white border-2 border-black rounded-none shadow-[4px_4px_0_#111] hover:translate-x-[-2px] hover:translate-y-[-2px]">
                  <Link href={f.href}>{f.cta}</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Similar Species Problem */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <Badge className="mb-4 text-xs md:text-sm bg-emerald-300 text-black border-2 border-black uppercase tracking-wide rounded-none">Spesies Mirip</Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-neutral-900">Kenapa Banyak Orang Bingung Membedakan Spesies?</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Beberapa spesies Felidae terlihat sangat mirip. Contoh umum: jaguar vs leopard, serval vs caracal, bahkan
              subspesies dengan pola mirip. Perbedaan halus membuat identifikasi jadi menantang, apalagi dari foto yang kurang ideal.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-none p-6 border-2 border-black shadow-[6px_6px_0_#111]"
            >
              <div className="mb-3 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Eye className="h-5 w-5 text-green-700" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-neutral-900">Mengapa Sulit Dibedakan?</h3>
              <ul className="space-y-3 text-neutral-600 text-sm">
                <li>• Morfologi serupa (pola tutul/roset, warna, ukuran tumpang tindih).</li>
                <li>• Variasi usia/jenis kelamin dan individu yang menipu visual.</li>
                <li>• Foto kurang ideal (sudut, pencahayaan, blur) menyembunyikan ciri pembeda.</li>
                <li>• Persebaran wilayah tumpang tindih membuat konteks lokasi kurang membantu.</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-none p-6 border-2 border-black shadow-[6px_6px_0_#111]"
            >
              <div className="mb-3 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Ruler className="h-5 w-5 text-green-700" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-neutral-900">Bagaimana Aplikasi Membantu?</h3>
              <ul className="space-y-3 text-neutral-600 text-sm">
                <li>• Ciri pembeda kunci di profil spesies (contoh: roset padat vs roset berongga, bentuk kepala/ekor).</li>
                <li>• Konteks habitat & persebaran berdampingan untuk penyaring cepat.</li>
                <li>• Pengelompokan “Mirip dengan” per spesies untuk bandingkan kandidat.</li>
                <li>• Scanner AI memberi kandidat serupa dengan skor probabilitas sebagai alat bantu belajar.</li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" asChild className="bg-white border-2 border-black rounded-none shadow-[4px_4px_0_#111] hover:translate-x-[-2px] hover:translate-y-[-2px]">
                  <Link href="/database-explorer">Bandingkan di Database</Link>
                </Button>
                <Button size="sm" variant="secondary" asChild className="bg-white border-2 border-black rounded-none shadow-[4px_4px_0_#111] hover:translate-x-[-2px] hover:translate-y-[-2px]">
                  <Link href="/radial">Lihat Kedekatan Taksonomi</Link>
                </Button>
                <Button size="sm" asChild className="bg-emerald-500 text-white border-2 border-black rounded-none shadow-[4px_4px_0_#111] hover:translate-x-[-2px] hover:translate-y-[-2px]">
                  <Link href="/scanner">Coba Scanner</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Audience */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <Badge className="mb-4 text-sm bg-green-100 text-green-800 border-green-300">Untuk Siapa?</Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-neutral-900">Siapa yang Diuntungkan?</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <GraduationCap className="h-5 w-5 text-green-700" />, title: "Pelajar & Mahasiswa", desc: "Belajar taksonomi dari dasar dengan visual yang mudah dipahami." },
              { icon: <Users className="h-5 w-5 text-green-700" />, title: "Peneliti & Penggiat", desc: "Menyusun referensi cepat untuk diskusi dan kegiatan konservasi." },
              { icon: <Heart className="h-5 w-5 text-green-700" />, title: "Pecinta Kucing Liar", desc: "Mengenal spesies Felidae dengan cara yang seru dan informatif." },
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-white rounded-xl p-5 shadow-md border border-green-100"
              >
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center mb-3">
                  {p.icon}
                </div>
                <h3 className="text-base font-semibold mb-1 text-neutral-900">{p.title}</h3>
                <p className="text-neutral-600 text-sm">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology / Sources */}
      <section className="py-16 px-4 bg-black text-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <Badge className="mb-4 text-xs md:text-sm bg-emerald-300 text-black border-2 border-black uppercase tracking-wide rounded-none">Bagaimana Kami Menyusun Data</Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Metodologi Singkat</h2>
            <p className="text-green-100 max-w-2xl mx-auto">
              Data dikelola di database terstruktur dan ditampilkan melalui antarmuka yang konsisten. Konten dirangkum
              dari referensi ilmiah dan sumber terpercaya yang dikurasi, lalu disajikan dengan pendekatan edukatif.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <DatabaseIcon className="h-5 w-5" />, title: "Database Terstruktur", desc: "Genus dan spesies disimpan rapi untuk kemudahan pencarian dan analisis." },
              { icon: <Layers className="h-5 w-5" />, title: "Visualisasi Radial", desc: "Membantu memahami kekerabatan dan hierarki dengan lebih cepat." },
              { icon: <Scan className="h-5 w-5" />, title: "Pendukung AI", desc: "Scanner sebagai alat bantu belajar, bukan penentu identifikasi final." },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-white text-black rounded-none p-5 border-2 border-black shadow-[6px_6px_0_#111] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  {s.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-neutral-700 text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 text-center"
          >
            <div className="inline-flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" className="bg-emerald-500 text-black border-2 border-black rounded-none shadow-[4px_4px_0_#111] hover:translate-x-[-2px] hover:translate-y-[-2px]" asChild>
                <Link href="/database-explorer">Mulai dari Database</Link>
              </Button>
              <Button size="lg" variant="secondary" className="bg-white border-2 border-black rounded-none shadow-[4px_4px_0_#111] hover:translate-x-[-2px] hover:translate-y-[-2px]" asChild>
                <Link href="/radial">Lihat Struktur Taksonomi</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white border-2 border-black text-black rounded-none shadow-[4px_4px_0_#111] hover:translate-x-[-2px] hover:translate-y-[-2px]" asChild>
                <Link href="/scanner">Coba Scanner</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <Badge className="mb-4 text-xs md:text-sm bg-emerald-300 text-black border-2 border-black uppercase tracking-wide rounded-none">Kontak</Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-neutral-900">Informasi Peneliti</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Untuk kolaborasi, saran, atau pertanyaan mengenai riset dan pengembangan aplikasi ini, silakan hubungi:
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Mail className="h-5 w-5" />, title: "Email", value: "peneliti@example.com", link: "mailto:peneliti@example.com" },
              { icon: <MapPin className="h-5 w-5" />, title: "Lokasi", value: "Semarang, Indonesia", link: "https://maps.google.com" },
              { icon: <Phone className="h-5 w-5" />, title: "Telepon", value: "+62 821-XXXX-XXXX", link: "tel:+628211234567" },
            ].map((contact, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-none p-5 border-2 border-black shadow-[6px_6px_0_#111] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
              >
                <div className="w-10 h-10 rounded-none bg-emerald-300 text-black border-2 border-black flex items-center justify-center mb-4">
                  {contact.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-neutral-900">{contact.title}</h3>
                <Link href={contact.link} className="text-emerald-700 hover:text-emerald-800 underline underline-offset-2">
                  {contact.value}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
