// Script untuk test email confirmation
// Jalankan: node test-email-config.js

const { createClient } = require("@supabase/supabase-js")
require("dotenv").config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const siteUrl = process.env.SITE_URL

console.log("🔍 Checking Supabase Configuration...\n")

console.log("📋 Environment Variables:")
console.log(`- SUPABASE_URL: ${supabaseUrl ? "✅ Set" : "❌ Missing"}`)
console.log(`- SUPABASE_ANON_KEY: ${supabaseKey ? "✅ Set" : "❌ Missing"}`)
console.log(`- SITE_URL: ${siteUrl || "❌ Missing"}\n`)

if (!supabaseUrl || !supabaseKey) {
  console.log("❌ Missing required environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testEmailSignUp() {
  console.log("🧪 Testing email signup...\n")

  const testEmail = `test-${Date.now()}@example.com`
  const testPassword = "TestPassword123!"

  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: "Test User",
        },
        emailRedirectTo: `${siteUrl}/api/auth/callback`,
      },
    })

    console.log("📊 Signup Result:")
    if (error) {
      console.log(`❌ Error: ${error.message}`)
      console.log(`   Code: ${error.status}`)
      return
    }

    console.log(`✅ User created: ${data.user?.id}`)
    console.log(`📧 Email: ${data.user?.email}`)
    console.log(`✉️  Email confirmed: ${data.user?.email_confirmed_at ? "Yes" : "No"}`)
    console.log(`📤 Confirmation sent: ${data.user?.confirmation_sent_at ? "Yes" : "No"}`)

    if (data.user && !data.user.email_confirmed_at) {
      console.log("\n📝 Next Steps:")
      console.log("1. Check your email (including spam folder)")
      console.log("2. Verify Supabase email settings:")
      console.log("   - Dashboard → Authentication → Settings")
      console.log('   - Ensure "Confirm email" is enabled')
      console.log("   - Check Site URL matches your environment")
      console.log("3. Consider setting up custom SMTP for production")
    }

    // Clean up test user (optional)
    if (data.user?.id) {
      console.log("\n🧹 Cleaning up test user...")
      await supabase.auth.admin.deleteUser(data.user.id)
    }
  } catch (err) {
    console.log(`❌ Test failed: ${err.message}`)
  }
}

// Run test
testEmailSignUp()
  .then(() => {
    console.log("\n✅ Email configuration test completed")
  })
  .catch((err) => {
    console.log(`❌ Test error: ${err.message}`)
  })
