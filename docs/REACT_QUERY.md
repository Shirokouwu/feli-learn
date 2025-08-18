# React Query Implementation

Implementasi @tanstack/react-query untuk state management yang lebih robust dengan caching,
optimistic updates, dan error handling.

## Setup

### 1. Installation

```bash
bun add @tanstack/react-query
```

### 2. QueryClient Provider

QueryProvider sudah di setup di `providers/query-provider.tsx` dan di wrap di root layout
`app/layout.tsx`.

## Features

### 🔄 Automatic Caching

- Data di cache otomatis untuk mengurangi network requests
- Stale time: 5 menit untuk profile, 2 menit untuk scan history
- Smart refetching saat window focus

### 🚀 Optimistic Updates

- Update UI langsung sebelum API response
- Rollback otomatis jika request gagal
- Smooth UX dengan loading states

### 📡 Background Refetching

- Data refresh otomatis di background
- Always fresh data tanpa loading spinner
- Configurable refetch strategies

## Hooks

### useUserProfile()

Hook untuk mengelola profil user dengan React Query.

**Features:**

- Fetch profile dengan caching
- Update profile dengan optimistic updates
- Upload/remove avatar
- Error handling dengan toast notifications

**Usage:**

```tsx
const { profile, loading, updating, uploadingAvatar, updateProfile, uploadAvatar, removeAvatar } =
  useUserProfile()
```

**Query Keys:**

```tsx
profileQueryKeys = {
  all: ["profile"],
  detail: ["profile", "detail"],
}
```

### useScanHistory()

Hook untuk mengelola riwayat scan dengan filtering dan sorting.

**Features:**

- Fetch scan history dengan caching
- Client-side filtering dan sorting
- Delete single item atau clear all
- Optimistic updates untuk delete operations

**Usage:**

```tsx
const { historyData, loading, deleteItem, clearAll, deletingItem, clearingAll } = useScanHistory({
  search: "query",
  sortBy: "newest",
})
```

**Query Keys:**

```tsx
scanHistoryQueryKeys = {
  all: ["scanHistory"],
  lists: ["scanHistory", "list"],
  list: (filters) => ["scanHistory", "list", { filters }],
}
```

## API Endpoints

### Profile APIs

- `GET /api/profile` - Fetch user profile
- `PUT /api/profile` - Update profile data
- `POST /api/profile/avatar` - Upload avatar
- `DELETE /api/profile/avatar` - Remove avatar

### Scan History APIs

- `GET /api/scan-history` - Fetch scan history
- `DELETE /api/scan-history` - Clear all history
- `DELETE /api/scan-history/[id]` - Delete single item

## Benefits

### 🎯 Performance

- Reduced API calls dengan intelligent caching
- Background updates tanpa loading states
- Optimized re-renders dengan stable query keys

### 🛠️ Developer Experience

- Declarative data fetching
- Built-in loading dan error states
- DevTools untuk debugging queries

### 👥 User Experience

- Instant feedback dengan optimistic updates
- Smooth transitions tanpa loading spinners
- Consistent error handling dengan toast messages

### 🔧 Reliability

- Automatic retries untuk failed requests
- Request deduplication
- Stale-while-revalidate caching strategy

## Query Configuration

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute default
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
})
```

## Best Practices

1. **Query Keys**: Gunakan hierarchical query keys untuk easy invalidation
2. **Error Boundaries**: Wrap komponen dengan error boundaries
3. **Loading States**: Tunjukkan appropriate loading indicators
4. **Optimistic Updates**: Update UI dulu, rollback jika gagal
5. **Cache Management**: Invalidate queries saat data berubah

## Migration dari useState

**Before:**

```tsx
const [profile, setProfile] = useState(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
  fetchProfile().then(setProfile)
}, [])
```

**After:**

```tsx
const { profile, loading } = useUserProfile()
```

Lebih simple, lebih robust, dan better UX! 🚀
