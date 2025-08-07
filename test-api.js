// Test script to check API connection
const axios = require("axios")

const API_HEALTH_URL = "https://pasiatri-api-cukururuk.hf.space/health"

async function testAPI() {
  console.log("Testing API connection...")
  console.log("URL:", API_HEALTH_URL)

  try {
    const response = await axios.get(API_HEALTH_URL, {
      timeout: 15000,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    console.log("Response status:", response.status)
    console.log("Response data:", response.data)
    console.log("API is working!")
  } catch (error) {
    console.error("Error testing API:", error.message)
    if (error.response) {
      console.error("Response status:", error.response.status)
      console.error("Response data:", error.response.data)
    }
  }
}

testAPI()
