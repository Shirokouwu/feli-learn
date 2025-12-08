# Scanner to Database Navigation

## Overview

Fitur untuk mengarahkan user dari hasil scanner langsung ke halaman detail spesies di database
berdasarkan scientific name yang teridentifikasi.

## Implementation

### 1. URL Slug Generation

Scientific name dikonversi ke URL-friendly slug format:

**Contoh:**

- `Acinonyx jubatus` → `acinonyx-jubatus`
- `Panthera leo` → `panthera-leo`
- `Felis catus` → `felis-catus`

**Function:**

```typescript
const getSpeciesSlug = (scientificName: string): string => {
  return scientificName
    .toLowerCase()
    .replace(/\s+/g, "-") // Spaces → hyphens
    .replace(/[^a-z0-9-]/g, "") // Remove special chars
    .trim()
}
```

### 2. Navigation Function

```typescript
const navigateToDatabase = () => {
  if (!scanResult) return
  const scientificName = enhancedSpeciesData?.identifikasi.nama_ilmiah || scanResult.scientific_name
  const slug = getSpeciesSlug(scientificName)
  router.push(`/database/${slug}`)
}
```

### 3. User Interface

#### A. Interactive Scientific Name Card

Scientific name card sekarang **clickable** dengan visual feedback:

**Features:**

- 🖱️ **Hover Effect**: Shadow meningkat, warna berubah
- ➡️ **Arrow Indicator**: Muncul saat hover
- 💬 **Hint Text**: "Klik untuk melihat informasi lengkap di database"
- ⌨️ **Keyboard Accessible**: Support Enter key
- 🎯 **Cursor**: Changes to pointer

**Before (Static):**

```
┌─────────────────────────────┐
│  Acinonyx jubatus          │
│  Cheetah                    │
└─────────────────────────────┘
```

**After (Interactive with hover):**

```
┌─────────────────────────────┐
│  Acinonyx jubatus  →        │
│  Cheetah                    │
│  Klik untuk info lengkap    │
└─────────────────────────────┘
     ↑ Hover effect active
```

#### B. Primary CTA Button

Main button dengan prominent styling:

```tsx
<Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 group" onClick={navigateToDatabase}>
  <Info className="h-4 w-4 mr-2" />
  Informasi Lengkap di Database
  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1" />
</Button>
```

**Features:**

- ✅ Primary action (emerald background)
- 🎯 Direct navigation ke spesies page
- 📱 Responsive text (short on mobile)
- 🎨 Animated arrow on hover

#### C. Secondary Button

Alternative untuk explore general database:

```tsx
<Button variant="outline" onClick={() => router.push("/database")}>
  <Search className="h-4 w-4 mr-2" />
  Jelajahi Database
</Button>
```

## User Flow

```
1. User melakukan scan
         ↓
2. Scanner mendeteksi spesies
   (e.g., "Acinonyx jubatus")
         ↓
3. Result ditampilkan dengan:
   - Clickable scientific name card
   - "Informasi Lengkap di Database" button
         ↓
4. User klik salah satu:
   a) Scientific name card
   b) Primary button
         ↓
5. Navigate to: /database/acinonyx-jubatus
         ↓
6. Species detail page terbuka
```

## Path Examples

| Scientific Name   | Slug Generated    | Database URL                |
| ----------------- | ----------------- | --------------------------- |
| Acinonyx jubatus  | acinonyx-jubatus  | /database/acinonyx-jubatus  |
| Panthera leo      | panthera-leo      | /database/panthera-leo      |
| Felis catus       | felis-catus       | /database/felis-catus       |
| Panthera tigris   | panthera-tigris   | /database/panthera-tigris   |
| Neofelis nebulosa | neofelis-nebulosa | /database/neofelis-nebulosa |

## Components Modified

### `scanner-result-display.tsx`

**Location:** `components/scanner/scanner-result-display.tsx`

**Changes:**

1. Added `getSpeciesSlug()` function
2. Added `navigateToDatabase()` function
3. Made scientific name card interactive
4. Updated primary button to navigate to specific species
5. Added secondary button for general database exploration

## Visual Feedback

### Hover States

```css
.scientific-name-card:hover {
  /* Shadow increase */
  shadow: md → lg

  /* Text color change */
  text-emerald-800 → text-emerald-600

  /* Arrow appears */
  opacity: 0 → 100
  translateX: 0 → 1

  /* Hint text appears */
  opacity: 0 → 100
}
```

### Button States

```css
.primary-button:hover {
  bg-emerald-600 → bg-emerald-700
  shadow-md → shadow-lg
  arrow translateX(0) → translateX(4px)
}
```

## Accessibility

✅ **Keyboard Navigation:**

- Tab to focus on scientific name card
- Enter key to navigate

✅ **ARIA:**

- `role="button"` on clickable card
- `tabIndex={0}` for keyboard access

✅ **Screen Readers:**

- Descriptive hint text
- Icon labels

## Mobile Optimization

### Responsive Text

- **Desktop:** "Informasi Lengkap di Database"
- **Mobile:** "Lihat Detail"

### Touch Targets

- Minimum 44x44px touch areas
- Clear visual feedback on tap

## Benefits

### User Experience

✅ **Seamless Navigation** - Direct path dari scan ke detail ✅ **Visual Clarity** - Clear
indication of clickable elements ✅ **Multiple Entry Points** - Card + Button options ✅ **Fast
Access** - One click to full information

### Technical

✅ **SEO Friendly** - Clean URL structure ✅ **Dynamic Routing** - Support semua species names ✅
**Error Handling** - Graceful fallback jika data tidak ada ✅ **Type Safety** - Full TypeScript
support

## Future Enhancements

- [ ] Add loading state during navigation
- [ ] Preview tooltip on hover (quick species info)
- [ ] Breadcrumb trail (Scanner → Database → Species)
- [ ] Back button yang kembali ke scanner dengan state preserved
- [ ] Analytics tracking untuk popular species
- [ ] Share species detail link
- [ ] Add to bookmarks from result page

## Testing

### Manual Test Cases

1. **Basic Navigation:**

   - Scan any species
   - Click scientific name → Should navigate
   - Click primary button → Should navigate
   - Check URL matches slug format

2. **Edge Cases:**

   - Special characters in scientific name
   - Very long scientific names
   - Scientific names with numbers

3. **Responsive:**

   - Test on mobile viewport
   - Verify button text changes
   - Check touch target sizes

4. **Accessibility:**
   - Tab navigation
   - Enter key activation
   - Screen reader compatibility

### Example Test

```typescript
// Test slug generation
describe("getSpeciesSlug", () => {
  it("converts scientific name to slug", () => {
    expect(getSpeciesSlug("Acinonyx jubatus")).toBe("acinonyx-jubatus")
    expect(getSpeciesSlug("Panthera leo")).toBe("panthera-leo")
  })

  it("handles special characters", () => {
    expect(getSpeciesSlug("Species (subspecies)")).toBe("species-subspecies")
  })
})
```

## Related Documentation

- Database dynamic routing: `app/(features)/database/[species]/page.tsx`
- Scanner result display: `components/scanner/scanner-result-display.tsx`
- Species matcher: `lib/species-matcher.ts`
