# Felidae Classifier API Documentation

## Overview

Felidae Classifier API adalah layanan REST API yang menggunakan model TensorFlow untuk
mengklasifikasikan spesies kucing liar (Felidae). API ini dapat mengidentifikasi 30 spesies berbeda
dalam keluarga Felidae, mulai dari kucing domestik hingga kucing besar seperti harimau, singa, dan
cheetah.

## Base URL

```
https://pasiatri-api-cukururuk.hf.space/predict
```

## Teknologi

- **Framework**: FastAPI
- **Machine Learning**: TensorFlow/Keras
- **Model**: Xception (fine-tuned)
- **Image Processing**: PIL (Python Imaging Library)

## Spesies yang Didukung

API ini dapat mengklasifikasikan 30 spesies Felidae berikut:

| Nama Kelas                    | Spesies Key              | Deskripsi            |
| ----------------------------- | ------------------------ | -------------------- |
| A Cheetah                     | acinonyx_jubatus         | Cheetah              |
| C Caracal                     | caracal_caracal          | Caracal              |
| Catopuma Temminckii           | catopuma_temminckii      | Asian Golden Cat     |
| F Bieti Chinese Mountain      | felis_bieti              | Chinese Mountain Cat |
| F Catus Domestic              | felis_catus              | Domestic Cat         |
| F Margarita Sand              | felis_margarita          | Sand Cat             |
| F Nigripes Blackfoot          | felis_nigripes           | Black-footed Cat     |
| F Silvestris European         | felis_silvestris         | European Wildcat     |
| F Lybica African              | felis_lybica             | African Wildcat      |
| H Jaguarundi                  | herpailurus_yagouaroundi | Jaguarundi           |
| L Serval                      | leptailurus_serval       | Serval               |
| L Lynx Canadensis Kanada      | lynx_canadensis          | Canada Lynx          |
| L Lynx Lynx Eurasia           | lynx_lynx                | Eurasian Lynx        |
| L Lynx Pardinus Iberia        | lynx_pardinus            | Iberian Lynx         |
| L Lynx Rufus Bobcat           | lynx_rufus               | Bobcat               |
| Leo Colocola Pampas           | leopardus_colocola       | Pampas Cat           |
| Leo Pardalis Oselot           | leopardus_pardalis       | Ocelot               |
| Leo Wiedii Margay             | leopardus_wiedii         | Margay               |
| N Nebulosa Dahan              | neofelis_nebulosa        | Clouded Leopard      |
| Oto Manul Pallas              | otocolobus_manul         | Pallas's Cat         |
| P Lion                        | panthera_leo             | Lion                 |
| P Jaguar                      | panthera_onca            | Jaguar               |
| P Leopard                     | panthera_pardus          | Leopard              |
| P Macan Tutul Salju           | panthera_uncia           | Snow Leopard         |
| P Tiger                       | panthera_tigris          | Tiger                |
| Pri Bengalensis Kuwuk Leopard | prionailurus_bengalensis | Leopard Cat          |
| Pri Planiceps Datar           | prionailurus_planiceps   | Flat-headed Cat      |
| Pri Rubiginosus Totol         | prionailurus_rubiginosus | Rusty-spotted Cat    |
| Pri Viverrinus Bakau          | prionailurus_viverrinus  | Fishing Cat          |
| Pu Puma Concolor              | puma_concolor            | Puma/Mountain Lion   |

## Endpoints

### 1. Health Check

**GET** `/health`

Mengecek status kesehatan API dan ketersediaan model.

**Response:**

```json
{
  "status": "ok",
  "message": "API running normally"
}
```

### 2. Prediksi dari URL Gambar

**POST** `/predict/url`

Mengklasifikasikan gambar kucing dari URL.

**Request Body:**

```json
{
  "url": "https://example.com/cat-image.jpg",
  "threshold": 0.7
}
```

**Parameters:**

- `url` (string, required): URL gambar yang akan diklasifikasi
- `threshold` (float, optional): Ambang batas confidence (default: 0.7)

**Response (Felidae terdeteksi):**

```json
{
  "is_felidae": true,
  "predicted_class": "P Tiger",
  "species_key": "panthera_tigris",
  "confidence": 95.67,
  "all_classes": [
    {
      "class": "P Tiger",
      "species_key": "panthera_tigris",
      "probability": 95.67
    },
    {
      "class": "P Leopard",
      "species_key": "panthera_pardus",
      "probability": 3.21
    }
  ]
}
```

**Response (Bukan Felidae):**

```json
{
  "is_felidae": false,
  "message": "This animal is not from the Felidae family",
  "confidence": 45.32,
  "all_classes": [...]
}
```

### 3. Prediksi dari Upload File

**POST** `/predict/upload`

Mengklasifikasikan gambar kucing dari file yang di-upload.

**Request:**

- **Form Data:**
  - `image` (file, required): File gambar (PNG, JPG, JPEG, WEBP)
  - `threshold` (float, optional): Ambang batas confidence (default: 0.7)

**Response:** Sama seperti endpoint `/predict/url`

### 4. Daftar Kelas

**GET** `/classes`

Mendapatkan daftar semua kelas yang dapat diklasifikasi.

**Response:**

```json
{
  "classes": ["A cheetah", "C caracal", "Catopuma temminckii", "..."]
}
```

### 5. Mapping Spesies

**GET** `/species-mapping`

Mendapatkan mapping nama kelas ke species key.

**Response:**

```json
{
  "mapping": {
    "A cheetah": "acinonyx_jubatus",
    "C caracal": "caracal_caracal",
    "..."
  }
}
```

## Error Responses

### HTTP Status Codes

- **200**: OK - Request berhasil
- **400**: Bad Request - Parameter tidak valid
- **500**: Internal Server Error - Error pada server
- **503**: Service Unavailable - Model tidak tersedia

### Error Format

```json
{
  "detail": "Error message description"
}
```

## Contoh Penggunaan

### Menggunakan cURL

**1. Health Check:**

```bash
curl -X GET "http://localhost:8000/health"
```

**2. Prediksi dari URL:**

```bash
curl -X POST "http://localhost:8000/predict/url" \
     -H "Content-Type: application/json" \
     -d '{
       "url": "https://example.com/tiger.jpg",
       "threshold": 0.7
     }'
```

**3. Upload File:**

```bash
curl -X POST "http://localhost:8000/predict/upload" \
     -F "image=@/path/to/image.jpg" \
     -F "threshold=0.7"
```

### Menggunakan Python requests

```python
import requests

# Prediksi dari URL
url = "http://localhost:8000/predict/url"
data = {
    "url": "https://example.com/cat.jpg",
    "threshold": 0.7
}
response = requests.post(url, json=data)
result = response.json()

# Upload file
url = "http://localhost:8000/predict/upload"
files = {"image": open("cat.jpg", "rb")}
data = {"threshold": 0.7}
response = requests.post(url, files=files, data=data)
result = response.json()
```

### Menggunakan JavaScript (Fetch API)

```javascript
// Prediksi dari URL
const predictFromUrl = async () => {
  const response = await fetch("/predict/url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: "https://example.com/cat.jpg",
      threshold: 0.7,
    }),
  })

  const result = await response.json()
  console.log(result)
}

// Upload file
const predictFromFile = async (fileInput) => {
  const formData = new FormData()
  formData.append("image", fileInput.files[0])
  formData.append("threshold", "0.7")

  const response = await fetch("/predict/upload", {
    method: "POST",
    body: formData,
  })

  const result = await response.json()
  console.log(result)
}
```

## Konfigurasi Model

### Input Image Requirements

- **Format**: PNG, JPG, JPEG, WEBP
- **Size**: Gambar akan di-resize otomatis ke 224x224 pixels
- **Color**: RGB (konversi otomatis jika diperlukan)

### Preprocessing Steps

1. Resize ke 224x224 pixels
2. Normalisasi pixel values (0-255 → 0-1)
3. Expand dimensions untuk batch processing

### Confidence Threshold

- **Default**: 0.7 (70%)
- **Range**: 0.0 - 1.0
- Jika confidence di bawah threshold, hasil dianggap bukan Felidae

## Menjalankan API

### Requirements

```bash
pip install fastapi uvicorn tensorflow pillow requests numpy
```

### Development Mode

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Production Mode

```bash
python main.py
```

## Interactive API Documentation

Setelah menjalankan server, dokumentasi interaktif tersedia di:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Logging

API menggunakan Python's built-in logging dengan level INFO. Log mencakup:

- Model loading status
- Request processing information
- Error details
- Image download/processing information

## CORS

API dikonfigurasi dengan CORS middleware yang memungkinkan:

- All origins (`*`)
- All methods
- All headers
- Credentials support

## Catatan Penting

1. **Model File**: API membutuhkan file model `xception_felidae.h5` di direktori yang sama
2. **Memory Usage**: Model TensorFlow dapat menggunakan memory yang cukup besar
3. **Image Size**: Gambar besar akan mempengaruhi waktu processing
4. **URL Access**: Beberapa website mungkin memblok automated requests
5. **Timeout**: Request URL memiliki timeout 30 detik

## Troubleshooting

### Model tidak ditemukan

- Pastikan file `xception_felidae.h5` ada di direktori aplikasi
- Check permission file

### Error saat download gambar

- Verifikasi URL dapat diakses
- Check apakah server memblok automated requests
- Pastikan URL mengarah ke file gambar valid

### Performance Issues

- Gunakan gambar dengan ukuran yang reasonable
- Consider image compression untuk upload besar
- Monitor memory usage pada production
