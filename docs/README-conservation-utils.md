# Conservation Status Utilities

Utility functions untuk menangani status konservasi spesies dengan konsisten di seluruh aplikasi.

## Functions

### `getConservationStatusColor(status: string): string`

Mengembalikan class CSS Tailwind untuk badge status konservasi.

**Parameter:**

- `status`: String status konservasi (contoh: "Endangered", "Vulnerable", "Least Concern")

**Returns:** String class CSS untuk styling badge

**Contoh penggunaan:**

```tsx
import { getConservationStatusColor } from "@/lib/conservation-utils"

;<Badge className={getConservationStatusColor("Endangered")}>Endangered</Badge>
```

### `getConservationStatusHexColor(status: string | undefined): string`

Mengembalikan nilai hex color untuk status konservasi (untuk penggunaan di SVG/Canvas).

**Parameter:**

- `status`: String status konservasi (boleh undefined)

**Returns:** String hex color (contoh: "#fb7185")

**Contoh penggunaan:**

```tsx
import { getConservationStatusHexColor } from "@/lib/conservation-utils"

;<circle fill={getConservationStatusHexColor(species.conservation_status)} r="10" />
```

### `getConservationStatusDescription(status: string): string`

Mengembalikan deskripsi status konservasi dalam bahasa Indonesia.

**Parameter:**

- `status`: String status konservasi

**Returns:** String deskripsi status konservasi

**Contoh penggunaan:**

```tsx
import { getConservationStatusDescription } from "@/lib/conservation-utils"

;<p>{getConservationStatusDescription("Critically Endangered")}</p>
// Output: "Spesies yang menghadapi risiko kepunahan yang sangat tinggi di alam liar."
```

## Color Mapping

| Status                     | Badge Color      | Hex Color | Description                            |
| -------------------------- | ---------------- | --------- | -------------------------------------- |
| Extinct (EX)               | `bg-slate-600`   | `#4b5563` | Abu-abu gelap untuk spesies yang punah |
| Critically Endangered (CR) | `bg-rose-400`    | `#f87171` | Merah muda untuk sangat terancam       |
| Endangered (EN)            | `bg-red-400`     | `#fb7185` | Merah untuk terancam                   |
| Vulnerable (VU)            | `bg-orange-400`  | `#fb923c` | Oranye untuk rentan                    |
| Near Threatened (NT)       | `bg-amber-400`   | `#fbbf24` | Kuning untuk hampir terancam           |
| Least Concern (LC)         | `bg-emerald-400` | `#34d399` | Hijau untuk tidak terancam             |
| Data Deficient (DD)        | `bg-gray-400`    | `#a1a1aa` | Abu-abu untuk data kurang              |
| Not Evaluated (NE)         | `bg-gray-300`    | `#d1d5db` | Abu-abu terang untuk belum dievaluasi  |
| Default/Unknown            | `bg-blue-400`    | `#60a5fa` | Biru untuk status tidak diketahui      |

## File yang Menggunakan

- `components/scanner/scanner-result-display.tsx`
- `components/scanner/scan-history.tsx`
- `components/radial-taxonomy/radial-species-card.tsx`
- `components/radial-taxonomy/radial-diagram.tsx`
- `components/radial-taxonomy/radial-node.tsx`

## Import

Bisa diimport langsung dari utility:

```tsx
import { getConservationStatusColor } from "@/lib/conservation-utils"
```

Atau dari lib/utils.ts:

```tsx
import { getConservationStatusColor } from "@/lib/utils"
```
