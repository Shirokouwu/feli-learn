# 🐾 FelLearn - Felidae Species Identification & Learning Platform

**FelLearn** adalah aplikasi web edukasi yang menggunakan teknologi AI untuk mengidentifikasi spesies dalam keluarga Felidae (kucing liar) dan memberikan informasi edukatif tentang konservasi satwa liar.

![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black)
![React](https://img.shields.io/badge/React-19.1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green)
![TensorFlow](https://img.shields.io/badge/TensorFlow-AI%20Model-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-Styling-cyan)

## 🌟 Fitur Utama

### 🔍 **AI Scanner**
- **Identifikasi Otomatis**: Menggunakan Convolutional Neural Network (CNN) dengan akurasi hingga **98.5%**
- **41 Spesies Felidae**: Mendukung identifikasi spesies dari Cheetah, Singa, Macan Tutul, hingga Kucing Domestik
- **Real-time Processing**: Upload gambar dan dapatkan hasil identifikasi dalam hitungan detik
- **Confidence Score**: Menampilkan tingkat kepercayaan AI dalam identifikasi

### 📊 **Taksonomi Interaktif**
- **Diagram Radial**: Visualisasi hierarki taksonomi dari Kingdom hingga Spesies
- **Navigasi Interaktif**: Eksplorasi data taksonomi dengan antarmuka yang menarik
- **Detail Ilmiah**: Informasi lengkap nomenclature dan klasifikasi

### 📚 **Database Komprehensif**
- **Informasi Lengkap**: Karakteristik fisik, habitat, distribusi geografis
- **Status Konservasi**: Data terkini dari IUCN Red List
- **Galeri Media**: Foto dan video berkualitas tinggi
- **Perilaku & Diet**: Informasi mendalam tentang ekologi spesies

### 📱 **Antarmuka Modern**
- **Responsive Design**: Optimized untuk desktop, tablet, dan mobile
- **Glass Morphism UI**: Desain modern dengan efek glass
- **Dark/Light Mode**: Dukungan tema gelap dan terang
- **Progressive Enhancement**: Loading states dan error handling yang baik

### 👤 **Sistem Autentikasi**
- **Google OAuth**: Login mudah dengan akun Google
- **Supabase Auth**: Sistem autentikasi yang aman dan scalable
- **Profile Management**: Kelola profil dan riwayat scan
- **Avatar Upload**: Upload dan edit foto profil dengan crop tool

### 📈 **Riwayat & Statistik**
- **Scan History**: Simpan dan review hasil identifikasi sebelumnya
- **Personal Stats**: Statistik personal scanning dan learning progress
- **Export Data**: Download riwayat dalam format yang mudah dibaca

## 🛠️ Teknologi & Stack

### **Frontend**
- **Next.js 15.4.6** - React framework dengan App Router
- **React 19.1.1** - UI library terbaru
- **TypeScript** - Type safety dan developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **Framer Motion** - Animasi dan transisi
- **React Query** - State management dan data fetching

### **Backend & Database**
- **Supabase** - Backend-as-a-Service (BaaS)
- **PostgreSQL** - Relational database untuk data taksonomi
- **Supabase Storage** - File storage untuk gambar dan media
- **Row Level Security** - Database security dan authorization

### **AI & Machine Learning**
- **TensorFlow/Keras** - Model CNN untuk klasifikasi gambar
- **Python FastAPI** - API server untuk ML inference
- **Image Preprocessing** - Resize, normalisasi, dan augmentasi
- **Species Matching** - Algoritma pencocokan dengan database

### **Development Tools**
- **Bun** - Fast package manager dan runtime
- **ESLint** - Code linting dan quality
- **Prettier** - Code formatting
- **Husky** - Git hooks untuk quality control

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ atau **Bun** 1.0+
- **Git**
- **Supabase** account (untuk database)

### Installation

1. **Clone repository**
```bash
git clone https://github.com/Shirokouwu/feli-learn.git
cd feli-learn-2
```

2. **Install dependencies**
```bash
# Menggunakan Bun (recommended)
bun install

# Atau menggunakan npm
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env.local
```

Isi file `.env.local` dengan:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. **Run development server**
```bash
# Menggunakan Bun
bun dev

# Atau menggunakan npm
npm run dev
```

5. **Open browser**
Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

## 📁 Struktur Proyek

```
feli-learn-2/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (features)/        # Feature pages (scanner, radial)
│   ├── api/               # API routes
│   └── profile/           # User profile pages
├── components/            # Reusable UI components
│   ├── scanner/           # Scanner-related components
│   ├── radial-taxonomy/   # Taxonomy visualization
│   └── ui/                # Base UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── auth.ts           # Authentication logic
│   ├── supabase.ts       # Supabase client
│   └── species-matcher.ts # AI species matching
├── types/                 # TypeScript type definitions
├── migrations/            # Database migrations
└── docs/                  # Documentation
```

## 🔧 Available Scripts

```bash
# Development
bun dev          # Start development server with Turbopack
bun build        # Build for production
bun start        # Start production server
bun lint         # Run ESLint

# Database
bun db:migrate   # Run database migrations
bun db:seed      # Seed database with initial data

# Testing
bun test         # Run tests
bun test:watch   # Run tests in watch mode
```

## 🌐 API Documentation

Aplikasi ini mengintegrasikan dengan Felidae Classifier API yang mendukung:

- **30+ Spesies Felidae** - Dari Acinonyx jubatus hingga Felis catus
- **Multiple Input Methods** - Upload file atau URL gambar
- **High Accuracy** - CNN model dengan preprocessing optimal
- **Detailed Responses** - Confidence scores dan alternative predictions

Lihat [API Documentation](./docs/API-DOCS.md) untuk detail lengkap.

## 📊 Database Schema

### Tabel Utama:
- `taksonomi_spesies` - Data spesies lengkap
- `taksonomi_genus` - Informasi genus
- `taksonomi_gambar` - Galeri foto spesies
- `taksonomi_video` - Koleksi video edukasi
- `scan_history` - Riwayat identifikasi pengguna
- `species_clicks` - Statistik interaksi

Lihat [Database Setup](./docs/DATABASE_SETUP.md) untuk migrasi lengkap.

## 🎯 Roadmap

### Phase 1 ✅ (Completed)
- [x] AI Scanner dengan CNN model
- [x] Supabase integration
- [x] Google OAuth authentication
- [x] Responsive UI dengan Tailwind CSS
- [x] Taxonomy visualization

### Phase 2 🚧 (In Progress)
- [ ] Advanced filtering dan search
- [ ] Offline mode dengan PWA
- [ ] Multi-language support (ID/EN)
- [ ] Enhanced analytics dashboard

### Phase 3 📋 (Planned)
- [ ] Community features (user contributions)
- [ ] Educational quizzes dan games
- [ ] Mobile app (React Native)
- [ ] Integration dengan conservation organizations

## 🤝 Contributing

Kami menyambut kontribusi dari komunitas! Silakan:

1. Fork repository ini
2. Buat branch feature (`git checkout -b feature/amazing-feature`)
3. Commit perubahan (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buka Pull Request

Lihat [Contributing Guidelines](./CONTRIBUTING.md) untuk detail lebih lanjut.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🙏 Acknowledgments

- **TensorFlow Team** - Framework machine learning
- **Supabase** - Backend infrastructure
- **Next.js Team** - React framework
- **Radix UI** - Accessible components
- **IUCN** - Conservation status data
- **Unsplash** - Placeholder images

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/Shirokouwu/feli-learn/issues)
- **Documentation**: [Complete Docs](./docs/COMPLETE_DOCUMENTATION.md)
- **Email**: support@felilearn.com
- **Website**: [felilearn.vercel.app](https://felilearn.vercel.app)

---

**FelLearn** - *Mengenal dan Melestarikan Keluarga Felidae Melalui Teknologi* 🐾
