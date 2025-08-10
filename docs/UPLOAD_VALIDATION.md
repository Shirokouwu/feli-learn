# Upload Validation Documentation

## Overview

Halaman scanner sekarang dilengkapi dengan validasi upload yang komprehensif untuk memastikan file
yang diunggah sesuai dengan requirements dan dapat diproses dengan baik oleh AI model.

## Validasi File Upload

### 1. **Ukuran File**

- **Maksimal**: 10MB (10,485,760 bytes)
- **Pesan Error**: "Ukuran file terlalu besar. Maksimal 10MB."
- **Alasan**: Mencegah upload file yang terlalu besar yang dapat memperlambat proses atau
  menyebabkan timeout

### 2. **Tipe File (MIME Type)**

- **Format yang Didukung**:
  - `image/jpeg`
  - `image/jpg`
  - `image/png`
  - `image/webp`
- **Pesan Error**: "Format file tidak didukung. Gunakan JPG, PNG, atau WEBP."
- **Alasan**: Memastikan file adalah gambar dalam format yang dapat diproses oleh model AI

### 3. **Ekstensi File**

- **Ekstensi yang Didukung**:
  - `.jpg`
  - `.jpeg`
  - `.png`
  - `.webp`
- **Pesan Error**: "Ekstensi file tidak valid. Gunakan .jpg, .jpeg, .png, atau .webp"
- **Alasan**: Double-check terhadap ekstensi file untuk mencegah file yang di-rename

### 4. **Resolusi Gambar**

- **Minimum**: 100x100 piksel
- **Pesan Error**: "Resolusi gambar terlalu kecil. Minimal 100x100 piksel untuk hasil terbaik."
- **Alasan**: Memastikan gambar memiliki resolusi yang cukup untuk identifikasi yang akurat

### 5. **Validitas File Gambar**

- **Validasi**: File dapat di-load sebagai gambar yang valid
- **Pesan Error**: "File gambar tidak valid atau rusak."
- **Alasan**: Memastikan file benar-benar adalah gambar yang dapat dibaca, bukan file yang rusak
  atau di-rename

## Validasi URL Input

### 1. **Format URL**

- **Protokol**: Harus `http://` atau `https://`
- **Pesan Error**: "URL harus menggunakan protokol HTTP atau HTTPS."

### 2. **Ekstensi File pada URL**

- **Ekstensi Required**: URL harus berakhir dengan `.jpg`, `.jpeg`, `.png`, atau `.webp`
- **Pesan Error**: "URL harus mengarah ke file gambar dengan ekstensi .jpg, .jpeg, .png, atau .webp"

### 3. **Validitas URL**

- **Validasi**: URL harus dalam format yang valid
- **Pesan Error**: "Format URL tidak valid. Pastikan URL lengkap dan benar."

## Validasi API Status

- **Check**: API model harus tersedia sebelum upload
- **Pesan Error**: "API model tidak tersedia. Silakan coba lagi nanti."
- **Interval Check**: Setiap 30 detik

## Drag & Drop Support

- **Feature**: Upload area mendukung drag and drop
- **Validasi**: Semua validasi yang sama diterapkan untuk file yang di-drop
- **UX**: Visual feedback saat drag over

## Input File Configuration

```html
<input type="file" accept="image/*" onChange="{handleFileUpload}" />
```

## UI Feedback

- **Loading States**: Indicator loading saat validasi dimensi
- **Error Messages**: Toast notifications untuk setiap jenis error
- **Success States**: Preview gambar setelah validasi berhasil
- **File Input Reset**: Input dibersihkan setelah error untuk mencegah re-submission

## Error Handling

- **File Input Reset**: Input file direset setelah error
- **Memory Cleanup**: Object URLs di-revoke setelah validasi dimensi
- **Graceful Degradation**: Jika validasi gagal, user dapat mencoba file lain

## User Information

- Format yang didukung ditampilkan di UI: "Format: JPG, PNG, WEBP (Maks. 10MB)"
- Resolusi minimal ditampilkan: "Resolusi minimal: 100x100 piksel"
- Tips URL ditampilkan untuk input URL

## Technical Implementation

- Validasi dilakukan di `hooks/use-scanner-logic.ts`
- UI components di `components/scanner/scanner-upload-area.tsx`
- Type checking dengan TypeScript
- Memory management untuk Image objects
- Error boundaries untuk graceful error handling

## Future Enhancements

1. **Progressive Image Loading**: Show low-res preview while validating
2. **Batch Upload**: Support multiple files
3. **Image Compression**: Auto-compress large images
4. **Format Conversion**: Auto-convert unsupported formats
5. **Advanced Validation**: Check for image quality, blur detection
