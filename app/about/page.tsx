"use client"

import { motion } from "framer-motion"
import { Footer } from "@/components/footer"
import {
  Github,
  Instagram,
  Mail,
  Heart,
  Code,
  Leaf,
  Target,
  Lightbulb,
  Calendar,
  Rocket,
  Users,
  MessageSquare,
  Youtube,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const timeline = [
  {
    phase: "Riset & Perencanaan",
    period: "Fase 1",
    description: "Mengumpulkan data taksonomi Felidae dari berbagai sumber ilmiah dan merencanakan struktur aplikasi.",
    status: "completed",
  },
  {
    phase: "Pengembangan Core",
    period: "Fase 2",
    description: "Membangun fondasi aplikasi, database spesies, dan visualisasi diagram taksonomi radial.",
    status: "completed",
  },
  {
    phase: "UI/UX & Encyclopedia",
    period: "Fase 3",
    description: "Mengembangkan antarmuka pengguna yang intuitif dan sistem ensiklopedia yang komprehensif.",
    status: "in-progress",
  },
  {
    phase: "Fitur Interaktif",
    period: "Fase 4",
    description: "Menambahkan fitur perbandingan spesies, peta habitat, dan alat edukasi interaktif.",
    status: "upcoming",
  },
]

const futureFeatures = [
  {
    icon: Users,
    title: "Komunitas",
    description: "Forum diskusi untuk pecinta kucing dan peneliti berbagi pengetahuan.",
  },
  {
    icon: MessageSquare,
    title: "Kontribusi Pengguna",
    description: "Sistem untuk menerima saran, koreksi data, dan foto dari komunitas.",
  },
  {
    icon: Rocket,
    title: "Mobile App",
    description: "Aplikasi mobile untuk akses ensiklopedia Felidae di mana saja.",
  },
]

const socialLinks = [
  {
    icon: Instagram,
    label: "Instagram",
    href: "https://instagram.com/firma.alt",
    username: "@firma.alt",
  },
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/arufars",
    username: "arufars",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:klasifikasifelidae@gmail.com",
    username: "klasifikasifelidae@gmail.com",
  },
]

const inspirationSources = [
  {
    name: "Alam Semenit",
    type: "YouTube Channel",
    description:
      "Channel edukasi yang menyajikan fakta-fakta menarik tentang alam dan satwa liar dalam format yang singkat dan mudah dipahami.",
    link: "https://youtube.com/@alamsemenit",
    color: "from-red-500/20 to-orange-500/20",
  },
  {
    name: "Dunia Alam",
    type: "YouTube Channel",
    description:
      "Konten berkualitas tentang kehidupan satwa liar, dokumenter alam, dan edukasi lingkungan yang menginspirasi kecintaan terhadap alam.",
    link: "https://youtube.com/@duniaalam",
    color: "from-emerald-500/20 to-teal-500/20",
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              Tentang Proyek Ini
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Mengenal Lebih Dekat <span className="text-primary">Felidae</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Proyek ini lahir dari kecintaan terhadap alam dan keinginan untuk membuat ilmu taksonomi lebih mudah
              dipahami oleh semua orang.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Developer Profile */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card border border-border rounded-2xl overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-0">
              {/* Profile Image Side */}
              <div className="relative bg-gradient-to-br from-primary/20 to-primary/5 p-8 flex items-center justify-center min-h-[400px]">
                <div className="absolute inset-0 opacity-10">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                    <rect width="100" height="100" fill="url(#grid)" />
                  </svg>
                </div>
                <div className="relative">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-2xl">
                    <span className="text-7xl font-serif font-bold text-primary-foreground">F</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 rounded-full bg-background border-4 border-card flex items-center justify-center">
                    <Code className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </div>

              {/* Profile Info Side */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    Developer
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium">
                    Nature Enthusiast
                  </span>
                </div>

                <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Firman</h2>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Seorang pengembang web yang memiliki ketertarikan mendalam terhadap keindahan alam. Melalui proyek
                  Felidae, saya ingin menggabungkan dua passion ini untuk menciptakan platform edukasi yang membantu
                  semua orang memahami dunia taksonomi, khususnya keluarga kucing yang begitu dekat dengan kehidupan
                  kita sehari-hari.
                </p>

                {/* Social Links */}
                <div className="flex flex-col gap-3">
                  {socialLinks.map((social) => (
                    <Link
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <social.icon className="w-5 h-5 group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{social.label}</p>
                        <p className="text-xs text-muted-foreground">{social.username}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Sumber Inspirasi
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">Terinspirasi Dari</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Proyek Felidae tidak akan ada tanpa konten-konten edukatif berkualitas yang menginspirasi kecintaan
              terhadap alam dan satwa liar.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {inspirationSources.map((source, index) => (
              <motion.div
                key={source.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={source.link} target="_blank" rel="noopener noreferrer" className="block group">
                  <div
                    className={`relative overflow-hidden bg-gradient-to-br ${source.color} border border-border rounded-2xl p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5`}
                  >
                    <div className="absolute top-4 right-4">
                      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                        <Youtube className="w-5 h-5 text-red-500" />
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-xl bg-background/80 backdrop-blur-sm flex items-center justify-center shrink-0">
                        <span className="text-2xl font-bold text-primary">{source.name.charAt(0)}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-muted-foreground">{source.type}</span>
                        <h3 className="font-serif text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {source.name}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{source.description}</p>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-sm text-primary font-medium">
                      <span>Kunjungi Channel</span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center text-muted-foreground mt-8 text-sm"
          >
            Terima kasih kepada para kreator konten yang telah menginspirasi dan mengedukasi banyak orang tentang
            keindahan alam.
          </motion.p>
        </div>
      </section>
      {/* End of Inspiration Section */}

      {/* Mission & Vision */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Target className="w-4 h-4" />
              Visi & Misi
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">Visi & Misi</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Mengapa proyek Felidae ini dibuat dan apa yang ingin dicapai.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card border border-border rounded-xl p-8"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground mb-4">Visi</h3>
              <p className="text-muted-foreground leading-relaxed">
                Menjadi platform edukasi taksonomi yang paling mudah diakses dan dipahami oleh siapa saja, dari pelajar
                hingga peneliti. Membantu masyarakat mengenal keanekaragaman hayati, khususnya keluarga Felidae, dengan
                cara yang menarik dan interaktif.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-card border border-border rounded-xl p-8"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                <Lightbulb className="w-7 h-7 text-emerald-500" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground mb-4">Misi</h3>
              <ul className="text-muted-foreground space-y-3">
                <li className="flex items-start gap-2">
                  <Leaf className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Menyajikan informasi taksonomi yang akurat dan mudah dipahami</span>
                </li>
                <li className="flex items-start gap-2">
                  <Leaf className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Memvisualisasikan hubungan antar spesies secara interaktif</span>
                </li>
                <li className="flex items-start gap-2">
                  <Leaf className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Meningkatkan kesadaran akan pentingnya konservasi satwa liar</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Felidae */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-primary/5 to-transparent border border-border rounded-2xl p-8 lg:p-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-foreground">Mengapa Felidae?</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Dari sekian banyak keluarga hewan, mengapa memilih Felidae? Jawabannya sederhana:
                <span className="text-foreground font-medium">
                  {" "}
                  kucing adalah hewan yang paling dekat dengan kehidupan kita sehari-hari
                </span>
                .
              </p>
              <p>
                Hampir setiap orang pernah berinteraksi dengan kucing, entah itu kucing peliharaan di rumah atau kucing
                liar di lingkungan sekitar. Kedekatan ini menciptakan rasa ingin tahu yang alami tentang "kerabat"
                kucing rumahan kita yang hidup di alam liar.
              </p>
              <p>
                Melalui Felidae, saya ingin mengajak semua orang untuk menjelajahi dunia kucing besar dan kecil dari
                seluruh dunia. Dari singa yang gagah di Afrika, harimau yang megah di Asia, hingga kucing hutan yang
                mungil di Indonesia. Semuanya adalah bagian dari keluarga besar Felidae yang menakjubkan.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Calendar className="w-4 h-4" />
              Timeline Pengembangan
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">Perjalanan Proyek</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Dari ide hingga implementasi, berikut adalah fase-fase pengembangan proyek Felidae.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border md:left-1/2 md:-translate-x-0.5" />

            {/* Timeline Items */}
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex items-start gap-6 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                >
                  {/* Timeline Dot */}
                  <div
                    className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-background z-10"
                    style={{
                      backgroundColor:
                        item.status === "completed"
                          ? "rgb(34 197 94)"
                          : item.status === "in-progress"
                            ? "rgb(245 158 11)"
                            : "rgb(148 163 184)",
                    }}
                  />

                  {/* Content */}
                  <div
                    className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${index % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"
                      }`}
                  >
                    <div
                      className={`bg-card border border-border rounded-xl p-6 ${index % 2 === 0 ? "md:ml-auto" : ""}`}
                    >
                      <div className={`flex items-center gap-2 mb-2 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${item.status === "completed"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : item.status === "in-progress"
                                ? "bg-amber-500/10 text-amber-500"
                                : "bg-muted text-muted-foreground"
                            }`}
                        >
                          {item.status === "completed"
                            ? "Selesai"
                            : item.status === "in-progress"
                              ? "Sedang Berjalan"
                              : "Akan Datang"}
                        </span>
                        <span className="text-xs text-muted-foreground">{item.period}</span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{item.phase}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Future Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Rocket className="w-4 h-4" />
              Rencana ke Depan
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">Fitur yang Akan Datang</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Proyek ini terus berkembang. Berikut beberapa fitur yang sedang direncanakan berdasarkan masukan dari
              pengguna.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {futureFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Feedback CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-border rounded-xl p-8">
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">Punya Ide atau Saran?</h3>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Proyek ini terbuka untuk masukan dari siapa saja. Jika kamu punya ide fitur baru atau menemukan
                kesalahan data, jangan ragu untuk menghubungi saya.
              </p>
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="mailto:klasifikasifelidae@gmail.com">
                  <Mail className="w-4 h-4 mr-2" />
                  Kirim Saran
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
