"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Target, Mail, MapPin, Phone, GraduationCap, BookOpen, Heart, Shield, Leaf } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export default function TentangKami() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-16 px-4 bg-gradient-to-b from-green-50 to-white overflow-hidden">
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
                className="mb-4 text-sm bg-green-50 text-green-800 hover:bg-green-100 border-green-200"
              >
                Project Skripsi
              </Badge>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4 text-neutral-900">
                Pelestarian Felidae Melalui Edukasi Digital
              </h1>
              <p className="text-neutral-600 text-lg mb-6 leading-relaxed">
                Sebuah inisiatif skripsi yang bertujuan meningkatkan kesadaran dan pemahaman tentang keluarga Felidae
                untuk mendukung upaya konservasi melalui pendekatan taksonomi interaktif.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-video rounded-xl overflow-hidden shadow-lg"
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
                    <p className="text-white font-medium">Project Skripsi 2023</p>
                    <p className="text-green-200 text-sm">Edukasi Taksonomi Interaktif</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Latar Belakang Section */}
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
              className="mb-4 text-sm bg-green-100 text-green-800 hover:bg-green-200 border-green-300"
            >
              Latar Belakang
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-neutral-900">Mengapa Felidae?</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="prose prose-green max-w-none mb-8"
          >
            <p>
              Keluarga Felidae (kucing) merupakan salah satu kelompok karnivora yang paling terancam di dunia. Dari 40
              spesies kucing liar yang ada, 25 di antaranya terancam punah. Kurangnya pemahaman masyarakat tentang
              keanekaragaman dan peran ekologis Felidae menjadi salah satu hambatan dalam upaya konservasi.
            </p>
            <p>
              Project skripsi ini hadir sebagai solusi untuk menjembatani kesenjangan pengetahuan tersebut melalui
              pendekatan taksonomi interaktif yang memudahkan pemahaman tentang klasifikasi, evolusi, dan karakteristik
              unik dari setiap spesies Felidae.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {[
              {
                icon: <Shield className="h-6 w-6 text-green-600" />,
                title: "25 Spesies Terancam",
                description: "Lebih dari 60% spesies Felidae berada dalam status konservasi terancam",
              },
              {
                icon: <Leaf className="h-6 w-6 text-green-600" />,
                title: "Predator Kunci",
                description: "Felidae berperan penting dalam menjaga keseimbangan ekosistem",
              },
              {
                icon: <Heart className="h-6 w-6 text-green-600" />,
                title: "Edukasi Konservasi",
                description: "Pemahaman taksonomi mendukung upaya pelestarian yang lebih efektif",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 border border-green-100"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-neutral-900">{item.title}</h3>
                <p className="text-neutral-600 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tujuan Penelitian Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <Badge
              variant="secondary"
              className="mb-4 text-sm bg-green-100 text-green-800 hover:bg-green-200 border-green-300"
            >
              Tujuan Penelitian
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-neutral-900">Sasaran Project</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-green-100"
            >
              <div className="mb-5 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-neutral-900">Tujuan Utama</h3>
              <ul className="space-y-3 text-neutral-600">
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-green-600" />
                  </div>
                  <span>Mengembangkan visualisasi taksonomi Felidae yang interaktif dan edukatif</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-green-600" />
                  </div>
                  <span>Meningkatkan pemahaman masyarakat tentang keanekaragaman Felidae</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-green-600" />
                  </div>
                  <span>Mendukung upaya konservasi melalui edukasi digital yang mudah diakses</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-green-100"
            >
              <div className="mb-5 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-neutral-900">Manfaat Penelitian</h3>
              <ul className="space-y-3 text-neutral-600">
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-green-600" />
                  </div>
                  <span>Menyediakan sumber belajar interaktif tentang taksonomi Felidae</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-green-600" />
                  </div>
                  <span>Berkontribusi pada upaya konservasi melalui peningkatan kesadaran</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-green-600" />
                  </div>
                  <span>Mengembangkan model visualisasi data taksonomi yang dapat diadaptasi</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Metodologi Section */}
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
              className="mb-4 text-sm bg-green-100 text-green-800 hover:bg-green-200 border-green-300"
            >
              Metodologi
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-neutral-900">Pendekatan Penelitian</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=2066&auto=format&fit=crop"
                  alt="Pengembangan Aplikasi"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col justify-center"
            >
              <h3 className="text-xl font-bold mb-4 text-neutral-900">Tahapan Pengembangan</h3>
              <ol className="space-y-4 text-neutral-600">
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-800 font-medium text-sm">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">Pengumpulan Data Taksonomi</p>
                    <p className="text-sm mt-1">
                      Kompilasi data taksonomi Felidae dari sumber ilmiah terpercaya dan database konservasi
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-800 font-medium text-sm">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">Perancangan Visualisasi</p>
                    <p className="text-sm mt-1">
                      Pengembangan model visualisasi radial untuk menampilkan hubungan taksonomi secara intuitif
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-800 font-medium text-sm">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">Implementasi Aplikasi</p>
                    <p className="text-sm mt-1">
                      Pengembangan aplikasi web interaktif dengan fokus pada aksesibilitas dan pengalaman pengguna
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-800 font-medium text-sm">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">Evaluasi & Wawancara</p>
                    <p className="text-sm mt-1">
                      Pengujian dengan pengguna dan pengumpulan umpan balik melalui wawancara untuk menilai efektivitas
                    </p>
                  </div>
                </li>
              </ol>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Hasil Wawancara Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <Badge
              variant="secondary"
              className="mb-4 text-sm bg-green-100 text-green-800 hover:bg-green-200 border-green-300"
            >
              Hasil Wawancara
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-neutral-900">Temuan Penelitian</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Berdasarkan wawancara dengan berbagai responden, kami menemukan beragam tingkat pemahaman dan minat
              terhadap taksonomi Felidae.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              {
                icon: <BookOpen className="h-5 w-5 text-green-600" />,
                title: "Yang Memahami",
                description:
                  "Sebagian responden sudah memiliki pemahaman dasar tentang Felidae dan tertarik memperdalam pengetahuan mereka.",
              },
              {
                icon: <Users className="h-5 w-5 text-green-600" />,
                title: "Yang Tidak Tahu",
                description:
                  "Banyak responden yang belum familiar dengan taksonomi Felidae namun mengapresiasi visualisasi yang memudahkan pemahaman.",
              },
              {
                icon: <Heart className="h-5 w-5 text-green-600" />,
                title: "Yang Penasaran",
                description:
                  "Kelompok terbesar adalah mereka yang penasaran dan tertarik untuk belajar lebih lanjut melalui platform interaktif.",
              },
            ].map((finding, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 border border-green-100"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  {finding.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-neutral-900">{finding.title}</h3>
                <p className="text-neutral-600 text-sm">{finding.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-md border border-green-100 mb-8"
          >
            <h3 className="text-xl font-bold mb-4 text-neutral-900">Statistik Wawancara</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  value: "65%",
                  label: "Tertarik Belajar",
                  detail: "Melalui visualisasi",
                },
                {
                  value: "42%",
                  label: "Sudah Familiar",
                  detail: "Dengan beberapa spesies",
                },
                {
                  value: "78%",
                  label: "Apresiasi Visual",
                  detail: "Diagram radial",
                },
                {
                  value: "83%",
                  label: "Ingin Eksplorasi",
                  detail: "Lebih lanjut",
                },
              ].map((stat, i) => (
                <div key={i} className="text-center p-3">
                  <div className="text-2xl font-bold text-green-600 mb-1">{stat.value}</div>
                  <div className="text-neutral-800 font-medium text-sm mb-1">{stat.label}</div>
                  <div className="text-xs text-neutral-500">{stat.detail}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-md border border-green-100"
          >
            <h3 className="text-xl font-bold mb-4 text-neutral-900">Kesimpulan</h3>
            <p className="text-neutral-600 mb-4">
              Hasil wawancara menunjukkan bahwa visualisasi taksonomi interaktif berhasil membangkitkan ketertarikan
              pada topik yang sebelumnya dianggap kompleks. Meskipun tingkat pemahaman awal beragam, sebagian besar
              responden menunjukkan peningkatan minat setelah berinteraksi dengan platform.
            </p>
            <p className="text-neutral-600">
              Temuan ini mengindikasikan bahwa pendekatan visual dan interaktif memiliki potensi signifikan untuk
              menjembatani kesenjangan pengetahuan dan mendorong minat terhadap upaya pelestarian Felidae.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <Badge className="mb-4 text-sm bg-green-400/10 text-green-300 border-green-400/20">Kontak</Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Informasi Peneliti</h2>
            <p className="text-green-100 max-w-2xl mx-auto">
              Untuk informasi lebih lanjut tentang penelitian ini atau kolaborasi, silakan hubungi:
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Mail className="h-5 w-5" />,
                title: "Email",
                value: "peneliti@example.com",
                link: "mailto:peneliti@example.com",
              },
              {
                icon: <MapPin className="h-5 w-5" />,
                title: "Lokasi",
                value: "Semarang, Indonesia",
                link: "https://maps.google.com",
              },
              {
                icon: <Phone className="h-5 w-5" />,
                title: "Telepon",
                value: "+62 821-XXXX-XXXX",
                link: "tel:+628211234567",
              },
            ].map((contact, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/15 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  {contact.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{contact.title}</h3>
                <Link
                  href={contact.link}
                  className="text-green-300 hover:text-green-200 transition-colors duration-300"
                >
                  {contact.value}
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 text-center"
          >
            <Button size="lg" className="bg-white text-green-800 hover:bg-green-50 transition-all duration-300" asChild>
              <Link href="/radial">Jelajahi Taksonomi Felidae</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
