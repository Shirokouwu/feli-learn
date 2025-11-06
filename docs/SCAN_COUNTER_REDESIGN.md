# Scan Counter - Compact Horizontal Layout

## Overview

Redesigned scan counter dengan layout horizontal yang compact, menampilkan global stats
(alternating) di kiri dan user personal stats di kanan.

## Design Changes

### Previous Design

- Vertical layout dengan toggle button
- User harus klik toggle untuk switch antara global dan user stats
- Memakan banyak space
- Border bottom separator

### New Design

- **Horizontal compact layout**
- **No toggle needed** - stats ditampilkan bersamaan
- **Auto-alternating animation** untuk global stats
- **Minimal space** - Di pojok kiri dan kanan

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  🌍 [432]          MAIN CONTENT             [12] 👤 scan    │
│     total global                                 saya        │
│                                                              │
│     ↓ (alternates every 3s)                                 │
│                                                              │
│  🌍 [+5]                                                     │
│     hari ini                                                 │
└─────────────────────────────────────────────────────────────┘
```

## Components

### Left Side: Global Stats (Animated Alternating)

**Features:**

- 🔄 **Auto-alternates** every 3 seconds
- 📊 Shows **Total Global** → **Today's Scans** → repeat
- 🌍 Globe icon indicator
- 💚 Emerald color scheme

**Displays:**

1. **Total Global** (3 seconds)

   - Large number: Total scan count
   - Label: "total global"

2. **Today's Scans** (3 seconds)
   - Large number with "+" prefix
   - Label: "hari ini"

### Right Side: User Personal Stats

**Features:**

- 👤 User icon indicator
- 💙 Blue color scheme (different dari global)
- 📈 Shows user's total scans only
- 🎯 Always visible (no alternating)

**Displays:**

- User's total scan count
- Label: "scan saya"

## Technical Implementation

### Props

```typescript
interface ScanCounterProps {
  className?: string
  showUserStats?: boolean // Enable/disable user stats display
}
```

### State Management

```typescript
// Auto-alternating display
const [showGlobalToday, setShowGlobalToday] = useState(false)

// Animated counters
const [displayedGlobalTotal, setDisplayedGlobalTotal] = useState(0)
const [displayedGlobalToday, setDisplayedGlobalToday] = useState(0)
const [displayedUserTotal, setDisplayedUserTotal] = useState(0)
```

### Animation Logic

#### 1. Auto-Alternating (Every 3s)

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    setShowGlobalToday((prev) => !prev)
  }, 3000)
  return () => clearInterval(interval)
}, [])
```

#### 2. Counter Animation

```typescript
// Smooth counting animation from 0 to target
// Duration: ~1 second
// Increment: Calculated based on target value
```

#### 3. Transition Animation

```typescript
// Using Framer Motion AnimatePresence
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -10 }}
transition={{ duration: 0.3 }}
```

## Styling

### Compact Design

```css
/* Each stat card */
- padding: px-3 py-2
- rounded-lg
- bg-white/80 with backdrop-blur-sm
- shadow-sm
- Small icons: 3.5x3.5 (h-3.5 w-3.5)
- Small text: text-[10px]
```

### Color Schemes

#### Global Stats (Emerald)

```css
- Border: border-emerald-100
- Icon bg: bg-emerald-50
- Icon color: text-emerald-600
- Number: text-emerald-700
- Label: text-emerald-600
```

#### User Stats (Blue)

```css
- Border: border-blue-100
- Icon bg: bg-blue-50
- Icon color: text-blue-600
- Number: text-blue-700
- Label: text-blue-600
```

## Usage

### Basic (Global Only)

```tsx
<ScanCounter />
```

**Result:**

- Shows only left side (global stats)
- Auto-alternates between total and today

### With User Stats

```tsx
<ScanCounter showUserStats={true} />
```

**Result:**

- Shows both left (global) and right (user)
- Left alternates, right is static

## Visual States

### State 1: Global Total (0-3s)

```
┌──────────────┐              ┌──────────────┐
│  🌍  432     │              │     12  👤   │
│  total global│              │  scan saya   │
└──────────────┘              └──────────────┘
```

### State 2: Global Today (3-6s)

```
┌──────────────┐              ┌──────────────┐
│  🌍  +5      │              │     12  👤   │
│  hari ini    │              │  scan saya   │
└──────────────┘              └──────────────┘
```

### State 3: Back to Total (6-9s)

```
Repeats from State 1...
```

## Responsive Behavior

### Mobile

- Cards maintain size
- Flex layout ensures proper spacing
- Touch-friendly (no hover states)

### Desktop

- Same compact size
- Smooth animations
- Positioned at edges

## Performance

### Optimizations

1. **Separate timers** for each counter animation
2. **Cleanup** on component unmount
3. **Conditional rendering** - User stats only if `showUserStats={true}` AND data exists
4. **Memoized calculations** for increment values

### Memory Management

```typescript
// All intervals cleared on unmount
return () => clearInterval(interval)
```

## Benefits

### User Experience

✅ **No Interaction Required** - Auto-shows both stats ✅ **Always Visible** - No toggle or
switching needed ✅ **Space Efficient** - Compact horizontal layout ✅ **Clear Distinction** -
Different colors for global vs personal ✅ **Engaging** - Animated alternating keeps it interesting

### Technical

✅ **Performant** - Optimized animations ✅ **Accessible** - Clear labels and visual distinction ✅
**Maintainable** - Clean, modular code ✅ **Flexible** - Can show with or without user stats

## Animation Timeline

```
0s   - Component mounts, shows global total
0-1s - Counter animates from 0 to actual value
3s   - Switch to today's scans
3-4s - Counter animates
6s   - Switch back to total
6-7s - Counter animates
9s   - Switch to today again
...  - Continues alternating
```

## Comparison

| Feature            | Old Design      | New Design          |
| ------------------ | --------------- | ------------------- |
| Layout             | Vertical        | Horizontal          |
| Interaction        | Toggle button   | Auto-alternating    |
| Space Usage        | Large           | Compact             |
| Global Stats       | One at a time   | Alternating display |
| User Stats         | Toggle required | Always visible      |
| Visual Distinction | Icon only       | Color scheme        |
| Animation          | On data change  | Continuous          |

## Future Enhancements

- [ ] Pause alternating on hover
- [ ] Click to manually switch
- [ ] Customizable alternating interval
- [ ] Add transition sound effects
- [ ] Weekly/monthly stats in rotation
- [ ] Sparkline mini-chart
- [ ] Achievement badges

## Testing Checklist

- [ ] Global stats alternate correctly
- [ ] Counter animations smooth
- [ ] User stats display when logged in
- [ ] User stats hidden when not logged in
- [ ] Proper spacing in different viewports
- [ ] No layout shift during alternation
- [ ] Cleanup on unmount (no memory leaks)
- [ ] Responsive on mobile/tablet/desktop
