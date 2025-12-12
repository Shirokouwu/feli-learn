import axios from "axios"
import { useEffect } from "react"
import { toast } from "sonner"

interface UseApiHealthProps {
  apiChecking: boolean
  setApiChecking: (checking: boolean) => void
  setApiReady: (ready: boolean) => void
  setApiResponse: (response: { data: { status: string } }) => void
}

export const useApiHealth = ({
  apiChecking,
  setApiChecking,
  setApiReady,
  setApiResponse
}: UseApiHealthProps) => {
  const API_MODEL_HEALTH_URL = process.env.NEXT_PUBLIC_API_MODEL_HEALTH_URL || ""

  useEffect(() => {
    const checkApiHealth = async () => {
      if (!API_MODEL_HEALTH_URL) {
        // console.log("❌ API_MODEL_HEALTH_URL is empty or undefined")
        setApiChecking(false)
        setApiReady(false)
        setApiResponse({ data: { status: "error - no URL" } })
        return
      }

      setApiChecking(true)

      try {
        const fetchResponse = await axios.get(API_MODEL_HEALTH_URL, {

          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },

        })

        if (!fetchResponse.status || fetchResponse.status < 200 || fetchResponse.status >= 300) {
          throw new Error(`HTTP error! status: ${fetchResponse.status}`)
        }

        const data = fetchResponse.data

        const mockResponse = { data: data, status: fetchResponse.status }
        setApiResponse(mockResponse)
        setApiReady(data.status === "ok")

        if (data.status === "ok") {
          // console.log("✅ API is ready!")!")
        } else {
          // console.log("⚠️ API status is not ok:", data.status)
          toast.error("API Model tidak tersedia. Silakan hubungi developer untuk bantuan.")
        }

      } catch (error) {
        console.error("❌ API Health Check Error:", error)

        let errorMessage = "Unknown error"
        if (error instanceof Error) {
          errorMessage = error.message
        }

        // If it's a CORS error, we assume the API is available but blocked by browser
        if (error instanceof TypeError && (errorMessage.includes('CORS') || errorMessage.includes('fetch'))) {
          // console.log("🔄 CORS error detected, but assuming API is available for direct calls")
          setApiReady(true) // Assume API is available despite CORS
          setApiResponse({ data: { status: "cors-blocked-but-available" } })
        } else {
          setApiReady(false)
          setApiResponse({ data: { status: "error" } })
          toast.error("API Model tidak dapat diakses. Silakan hubungi developer untuk bantuan.")
        }
      } finally {
        setApiChecking(false)
      }
    }

    checkApiHealth()
    // Check API health only once on component mount

    return () => {
      // No cleanup needed since we're not using setInterval
    }
  }, [API_MODEL_HEALTH_URL, setApiChecking, setApiReady, setApiResponse])
}
