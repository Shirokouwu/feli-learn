// Debug script to check the database and API response format
// Copy and paste this into your browser console when on the application page

async function debugScannerIssue() {
  console.log("🔍 Debugging Scanner Database Issue")
  console.log("=====================================")

  // Import the supabase client
  try {
    // This assumes you have access to the supabase client in the browser
    const response = await fetch("/api/debug-species", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "check_felis_margarita",
      }),
    })

    if (response.ok) {
      const data = await response.json()
      console.log("📊 Debug Results:", data)
    } else {
      console.log("⚠️ API endpoint not available, checking manually...")

      // Manual check using browser globals if available
      if (typeof window !== "undefined" && window.supabase) {
        console.log("🔍 Checking database manually...")
        const { data, error } = await window.supabase
          .from("taksonomi_spesies")
          .select("*")
          .ilike("kunci", "%felis%margarita%")

        console.log("Database results:", { data, error })
      }
    }
  } catch (error) {
    console.error("❌ Error:", error)
    console.log("💡 Try running this manually in the scanner page after scanning an image")
  }
}

// Instructions
console.log(`
🛠️ Scanner Debug Helper

To debug the scanner issue:

1. Upload an image that should detect as "felis-margarita"
2. Open browser console and look for the log: "🔍 API Response:"
3. Check what species_key and predicted_class are returned
4. Run: debugScannerIssue()

Expected formats:
- API might return: "felis-margarita" (with hyphen)
- Database might have: "felis_margarita" (with underscore)

The fix should normalize the format automatically now.
`)

// Export for manual use
window.debugScannerIssue = debugScannerIssue
