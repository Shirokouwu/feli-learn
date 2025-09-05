# GlassNavigation Component

Komponen navigasi dengan efek glass morphism yang responsif terhadap scroll.

## Features

- ✅ Glass blur effect ketika scroll
- ✅ Width container dinamis (85% saat scroll, 90% saat diam)
- ✅ Warna teks hijau (teal) yang konsisten
- ✅ Animasi smooth dengan framer-motion
- ✅ User info dengan status login
- ✅ Customizable props

## Usage

### Basic Usage

```tsx
import { GlassNavigation } from "@/components/ui/glass-navigation"
import { useScrollDetection } from "@/hooks/use-scroll-detection"

function MyPage() {
  const isScrolled = useScrollDetection({ threshold: 100 })

  return (
    <>
      <GlassNavigation
        isScrolled={isScrolled}
        fullName="John Doe" // Optional: nama user jika login
      />
      {/* Your page content */}
    </>
  )
}
```

### Advanced Usage

```tsx
import { GlassNavigation } from "@/components/ui/glass-navigation"
import { useScrollDetection } from "@/hooks/use-scroll-detection"

function MyPage() {
  const isScrolled = useScrollDetection({ threshold: 150 })

  return (
    <>
      <GlassNavigation
        isScrolled={isScrolled}
        fullName="John Doe"
        backHref="/dashboard"
        backLabel="Dashboard"
        showUserInfo={true}
        className="border-2 border-teal-200"
      />
      {/* Your page content */}
    </>
  )
}
```

## Props

| Prop           | Type      | Default     | Description                                  |
| -------------- | --------- | ----------- | -------------------------------------------- |
| `isScrolled`   | `boolean` | Required    | Status scroll untuk trigger glass effect     |
| `fullName`     | `string`  | `undefined` | Nama user (jika ada), tampilkan status login |
| `backHref`     | `string`  | `"/"`       | URL tujuan tombol kembali                    |
| `backLabel`    | `string`  | `"Kembali"` | Label tombol kembali                         |
| `showUserInfo` | `boolean` | `true`      | Tampilkan/sembunyikan info user              |
| `className`    | `string`  | `""`        | CSS class tambahan                           |

## Hook: useScrollDetection

Hook untuk mendeteksi scroll dengan threshold yang dapat dikustomisasi.

```tsx
const isScrolled = useScrollDetection({
  threshold: 100, // Default: 100px
})
```

## Styling

Komponen menggunakan:

- **Glass effect**: `bg-white/10 backdrop-blur-xl`
- **Border**: `border-b border-white/20`
- **Shadow**: `shadow-lg`
- **Rounded corners**: `rounded-b-lg`
- **Teal color scheme**: Konsisten dengan design system

## Animation

- Smooth width transition: 90% → 85%
- Background opacity: transparent → glass
- Position: top-0 → top-5 (dengan rounded corners)
- Duration: 500ms
