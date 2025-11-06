"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { testResetPasswordEmail } from "../test-email"

export default function TestEmailPage() {
    const [email, setEmail] = useState("")
    const [result, setResult] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleTest = async () => {
        setIsLoading(true)
        setResult(null)

        console.clear()
        const res = await testResetPasswordEmail(email)
        setResult(res)
        setIsLoading(false)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-4">🧪 Test Reset Password Email</h1>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Email Address</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="test@example.com"
                            className="w-full"
                        />
                    </div>

                    <Button
                        onClick={handleTest}
                        disabled={isLoading || !email}
                        className="w-full"
                    >
                        {isLoading ? "Testing..." : "Test Send Email"}
                    </Button>

                    {result && (
                        <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                            <h3 className="font-bold mb-2">
                                {result.success ? '✅ Success!' : '❌ Failed'}
                            </h3>
                            <pre className="text-xs overflow-auto">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        </div>
                    )}

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-bold mb-2">📝 Instructions:</h3>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                            <li>Input email yang sudah terdaftar</li>
                            <li>Click "Test Send Email"</li>
                            <li>Open Browser Console (F12) untuk melihat detailed logs</li>
                            <li>Check email inbox (bisa delay 1-5 menit)</li>
                            <li>Check spam folder jika tidak muncul di inbox</li>
                        </ol>
                    </div>

                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                        <h3 className="font-bold mb-2">⚠️ Common Issues:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li><strong>Rate Limit:</strong> Max 4 emails/hour in development</li>
                            <li><strong>Unverified Email:</strong> Supabase won't send to unverified emails</li>
                            <li><strong>Spam Folder:</strong> Check spam/junk folder</li>
                            <li><strong>SMTP Delay:</strong> Can take up to 5 minutes</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
