# Scanner to Database - Testing Guide

## Quick Test Examples

### Test Species List

Berikut adalah daftar spesies Felidae yang bisa digunakan untuk testing navigasi:

| No  | Scientific Name    | Common Name     | Expected Slug      |
| --- | ------------------ | --------------- | ------------------ |
| 1   | Acinonyx jubatus   | Cheetah         | acinonyx-jubatus   |
| 2   | Panthera leo       | Lion            | panthera-leo       |
| 3   | Panthera tigris    | Tiger           | panthera-tigris    |
| 4   | Panthera pardus    | Leopard         | panthera-pardus    |
| 5   | Felis catus        | Domestic Cat    | felis-catus        |
| 6   | Lynx lynx          | Eurasian Lynx   | lynx-lynx          |
| 7   | Puma concolor      | Cougar/Puma     | puma-concolor      |
| 8   | Neofelis nebulosa  | Clouded Leopard | neofelis-nebulosa  |
| 9   | Panthera onca      | Jaguar          | panthera-onca      |
| 10  | Leopardus pardalis | Ocelot          | leopardus-pardalis |

## Testing Workflow

### 1. Basic Flow Test

```
Step 1: Go to /scanner
Step 2: Upload image of "Cheetah"
Step 3: Wait for scan result
Step 4: Verify scientific name shows: "Acinonyx jubatus"
Step 5: Click on scientific name card
Step 6: Verify navigation to: /database/acinonyx-jubatus
```

### 2. Interactive Elements Test

#### A. Scientific Name Card Hover

```
Action: Hover over scientific name
Expected:
  ✓ Shadow increases (md → lg)
  ✓ Arrow icon appears on right
  ✓ Hint text appears below
  ✓ Text color changes slightly
  ✓ Cursor changes to pointer
  ✓ Decorative circles scale up
```

#### B. Button Interaction

```
Action: Hover over "Informasi Lengkap di Database" button
Expected:
  ✓ Background darkens (emerald-600 → emerald-700)
  ✓ Shadow increases
  ✓ Arrow icon slides right
  ✓ Smooth transition
```

#### C. Keyboard Navigation

```
Action: Tab to scientific name card, press Enter
Expected:
  ✓ Card receives focus ring
  ✓ Enter key triggers navigation
  ✓ Navigate to correct species page
```

### 3. Mobile Responsive Test

#### Viewport: 375px (Mobile)

```
Expected:
  ✓ Button text shows: "Lihat Detail" (not full text)
  ✓ Secondary button shows: "Database"
  ✓ Touch targets are adequate (min 44px)
  ✓ Cards remain clickable
  ✓ Layout stacks vertically
```

#### Viewport: 768px (Tablet)

```
Expected:
  ✓ Full button text visible
  ✓ Cards side by side in tabs
  ✓ Hover effects work
```

### 4. Edge Cases Test

#### Special Characters

```
Test: Scientific name with parentheses
Input: "Panthera leo (African)"
Expected Slug: "panthera-leo-african"
Expected URL: /database/panthera-leo-african
```

#### Multiple Spaces

```
Test: Extra spaces in name
Input: "Panthera  leo"
Expected Slug: "panthera-leo"
Expected URL: /database/panthera-leo
```

#### Uppercase/Lowercase

```
Test: Mixed case input
Input: "PANTHERA LEO"
Expected Slug: "panthera-leo"
Expected URL: /database/panthera-leo
```

## Visual Test Checklist

### Result Display Elements

- [ ] Scientific name card is visible
- [ ] Scientific name is in italic font
- [ ] Common name is displayed
- [ ] Conservation status badge shown
- [ ] Primary button is prominent
- [ ] Secondary button is visible
- [ ] All icons render correctly

### Hover States

- [ ] Scientific name card hover works
- [ ] Arrow appears on hover
- [ ] Hint text appears on hover
- [ ] Button hover effects work
- [ ] Smooth transitions

### Navigation

- [ ] Click on scientific name navigates correctly
- [ ] Primary button navigates to species page
- [ ] Secondary button navigates to database home
- [ ] URL format is correct
- [ ] No console errors

## Automated Test Script

```javascript
// Cypress test example
describe("Scanner to Database Navigation", () => {
  it("should navigate to species detail from scan result", () => {
    // Navigate to scanner
    cy.visit("/scanner")

    // Perform scan (mock)
    cy.mockScanResult({
      scientific_name: "Acinonyx jubatus",
      name: "Cheetah",
    })

    // Verify scientific name is displayed
    cy.contains("Acinonyx jubatus").should("be.visible")

    // Click on scientific name
    cy.contains("Acinonyx jubatus").click()

    // Verify navigation
    cy.url().should("include", "/database/acinonyx-jubatus")
  })

  it("should show hover effects on scientific name card", () => {
    cy.visit("/scanner")
    cy.mockScanResult({
      scientific_name: "Panthera leo",
      name: "Lion",
    })

    // Trigger hover
    cy.contains("Panthera leo").parent().trigger("mouseover")

    // Check arrow visibility
    cy.get('[data-testid="navigation-arrow"]').should("have.class", "opacity-100")

    // Check hint text
    cy.contains("Klik untuk melihat informasi lengkap").should("be.visible")
  })
})
```

## Performance Test

### Page Load Time

```
Expected: < 1s for navigation
Test: Measure time from click to page render
Tool: Chrome DevTools Performance tab
```

### Interaction Response

```
Expected: < 100ms hover response
Test: Hover effects should be immediate
Tool: Chrome DevTools Animation inspector
```

## Accessibility Test

### Screen Reader Test

```
Tool: NVDA / JAWS
Expected Announcements:
  - "Acinonyx jubatus, button, Cheetah"
  - "Click to view full information in database"
  - "Information in Database, button"
```

### Keyboard Navigation

```
Tab Order:
  1. Scientific name card (should be focusable)
  2. Primary button
  3. Secondary button
  4. Tab navigation items
```

### Color Contrast

```
Tool: axe DevTools
Check:
  - Text on emerald background (AA/AAA)
  - Hover state contrast
  - Disabled states
```

## Browser Compatibility

Test on:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Common Issues & Solutions

### Issue 1: Navigation not working

```
Problem: Button click does nothing
Solution: Check router import and navigation function
Debug: console.log in navigateToDatabase()
```

### Issue 2: Wrong URL generated

```
Problem: Special chars not removed
Solution: Check regex in getSpeciesSlug()
Test: Try various scientific names
```

### Issue 3: Hover effect not showing

```
Problem: CSS transitions not working
Solution: Check Tailwind group class
Verify: Parent has 'group' class
```

### Issue 4: Mobile layout broken

```
Problem: Buttons too small on mobile
Solution: Check responsive classes (sm:, md:)
Verify: Touch target min 44x44px
```

## Regression Test Checklist

Before deploying:

- [ ] All test species navigate correctly
- [ ] Hover effects work
- [ ] Mobile responsive
- [ ] Keyboard accessible
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Works in all browsers
- [ ] Screen reader compatible

## Success Metrics

### User Engagement

- Click-through rate on scientific name card: > 30%
- Click-through rate on primary button: > 50%
- Bounce rate on species detail: < 20%

### Performance

- Navigation time: < 1s
- Interaction delay: < 100ms
- Page load: < 2s

### Error Rate

- Failed navigations: < 1%
- 404 errors: < 0.5%
- Console errors: 0
