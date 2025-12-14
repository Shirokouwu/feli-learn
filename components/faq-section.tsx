"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HelpCircle, ChevronDown, MessageCircleQuestion } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const faqs = [
  {
    question: "Apa itu Felidae dan mengapa penting untuk dipelajari?",
    answer:
      "Felidae adalah keluarga taksonomi yang mencakup semua spesies kucing, dari kucing rumah hingga singa dan harimau. Mempelajari Felidae penting karena membantu kita memahami evolusi, perilaku, dan kebutuhan konservasi dari 41 spesies kucing yang ada di dunia. Banyak di antaranya terancam punah dan membutuhkan perhatian khusus.",
  },
  {
    question: "Apakah aplikasi ini gratis digunakan?",
    answer:
      "Ya, aplikasi Felidae sepenuhnya gratis untuk digunakan. Kami percaya bahwa pengetahuan tentang taksonomi dan konservasi harus dapat diakses oleh semua orang. Fitur seperti diagram radial interaktif, ensiklopedia spesies, dan informasi konservasi tersedia tanpa biaya apapun.",
  },
  {
    question: "Bagaimana cara menggunakan diagram taksonomi radial?",
    answer:
      "Diagram taksonomi radial menampilkan hubungan hierarki antara Family, Genus, dan Species dalam bentuk lingkaran konsentris. Klik pada node manapun untuk melihat detail dan sub-takson terkait. Anda juga dapat melakukan zoom dan pan untuk navigasi yang lebih mudah, serta menggunakan filter untuk fokus pada genus atau status konservasi tertentu.",
  },
  {
    question: "Dari mana sumber data yang digunakan dalam aplikasi ini?",
    answer:
      "Data taksonomi dan konservasi kami bersumber dari database ilmiah terpercaya seperti IUCN Red List, Catalogue of Life, dan publikasi jurnal peer-reviewed. Kami secara berkala memperbarui informasi untuk memastikan akurasi dan relevansi data yang ditampilkan.",
  },
  {
    question: "Apa perbedaan antara status konservasi seperti VU, EN, dan CR?",
    answer:
      "Status konservasi mengikuti klasifikasi IUCN: LC (Least Concern) berarti risiko rendah, NT (Near Threatened) mendekati terancam, VU (Vulnerable) rentan, EN (Endangered) terancam punah, CR (Critically Endangered) kritis, dan EX (Extinct) sudah punah. Dalam keluarga Felidae, beberapa spesies seperti Harimau dan Macan Tutul Salju berstatus Endangered.",
  },
  {
    question: "Bisakah saya menggunakan data dari aplikasi ini untuk keperluan pendidikan?",
    answer:
      "Tentu saja! Aplikasi ini dirancang untuk tujuan edukasi. Anda bebas menggunakan informasi yang tersedia untuk tugas sekolah, presentasi, atau penelitian dengan mencantumkan sumber yang sesuai. Kami mendorong penyebaran pengetahuan tentang taksonomi dan pentingnya konservasi kucing liar.",
  },
  {
    question: "Apakah ada rencana untuk menambahkan fitur baru?",
    answer:
      "Ya, kami terus mengembangkan aplikasi ini. Beberapa fitur yang sedang dalam pengembangan termasuk: mode perbandingan antar spesies, peta distribusi geografis interaktif, timeline evolusi Felidae, dan fitur quiz untuk menguji pengetahuan Anda tentang kucing liar dunia.",
  },
  {
    question: "Bagaimana cara berkontribusi atau melaporkan kesalahan data?",
    answer:
      "Kami sangat menghargai masukan dari pengguna. Jika Anda menemukan kesalahan data atau ingin berkontribusi, silakan hubungi tim kami melalui halaman kontak atau kirim email. Setiap koreksi akan ditinjau oleh tim kami sebelum dipublikasikan untuk menjaga akurasi informasi.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const { ref, isInView } = useScrollAnimation({ threshold: 0.25 })

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="py-16 lg:py-20 xl:py-24 px-4 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header - Animasi lebih elegant dengan threshold 25% */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-10 lg:mb-14 xl:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 lg:mb-6">
            <MessageCircleQuestion className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Pusat Bantuan</span>
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif font-bold text-foreground mb-3 lg:mb-4">
            Pertanyaan yang <span className="text-primary">Sering Diajukan</span>
          </h2>

          <p className="text-muted-foreground text-base lg:text-lg max-w-2xl mx-auto">
            Temukan jawaban untuk pertanyaan umum tentang aplikasi Felidae, taksonomi kucing, dan fitur-fitur yang
            tersedia.
          </p>
        </motion.div>

        {/* FAQ Items - Animasi lebih subtle */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div
                className={`rounded-xl border transition-all duration-300 ${
                  openIndex === index
                    ? "bg-card border-primary/30 shadow-lg shadow-primary/5"
                    : "bg-card/50 border-border hover:border-primary/20 hover:bg-card"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                        openIndex === index ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <span
                      className={`font-medium text-base md:text-lg transition-colors ${
                        openIndex === index ? "text-foreground" : "text-foreground/80"
                      }`}
                    >
                      {faq.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex-shrink-0 ${openIndex === index ? "text-primary" : "text-muted-foreground"}`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-0">
                        <div className="pl-14">
                          <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA - Animasi lebih subtle */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-card border border-border">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageCircleQuestion className="w-6 h-6 text-primary" />
            </div>
            <div className="text-center sm:text-left">
              <p className="font-medium text-foreground">Masih punya pertanyaan?</p>
              <p className="text-sm text-muted-foreground">Hubungi tim kami untuk bantuan lebih lanjut</p>
            </div>
            <button className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
              Hubungi Kami
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
