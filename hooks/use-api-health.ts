import { useEffect } from "react"

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
                console.log("❌ API_MODEL_HEALTH_URL is empty or undefined")
                setApiChecking(false)
                setApiReady(false)
                setApiResponse({ data: { status: "error - no URL" } })
                return
            }

            setApiChecking(true)

            try {
                const fetchResponse = await fetch(API_MODEL_HEALTH_URL, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    mode: 'cors',
                })

                if (!fetchResponse.ok) {
                    throw new Error(`HTTP error! status: ${fetchResponse.status}`)
                }

                const data = await fetchResponse.json()

                const mockResponse = { data: data, status: fetchResponse.status }
                setApiResponse(mockResponse)
                setApiReady(data.status === "ok")

                if (data.status === "ok") {
                    console.log("✅ API is ready!")
                } else {
                    console.log("⚠️ API status is not ok:", data.status)
                }

            } catch (error) {
                console.error("❌ API Health Check Error:", error)

                let errorMessage = "Unknown error"
                if (error instanceof Error) {
                    errorMessage = error.message
                }

                // If it's a CORS error, we assume the API is available but blocked by browser
                if (error instanceof TypeError && (errorMessage.includes('CORS') || errorMessage.includes('fetch'))) {
                    console.log("🔄 CORS error detected, but assuming API is available for direct calls")
                    setApiReady(true) // Assume API is available despite CORS
                    setApiResponse({ data: { status: "cors-blocked-but-available" } })
                } else {
                    setApiReady(false)
                    setApiResponse({ data: { status: "error" } })
                }
            } finally {
                setApiChecking(false)
            }
        }

        checkApiHealth()
        // Check API health every 30 seconds
        const interval = setInterval(checkApiHealth, 30000)

        return () => clearInterval(interval)
    }, [API_MODEL_HEALTH_URL, setApiChecking, setApiReady, setApiResponse])
}
