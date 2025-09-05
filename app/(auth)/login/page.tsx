"use client"

import Image from "next/image"
import Link from "next/link"
import { Leaf, Eye, EyeOff } from "lucide-react"
import { useActionState, useState } from "react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { loginAction } from "../_action"
import AuthGoogle from "../auth-google"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [state, formAction, pending] = useActionState(loginAction, {
    message: "",
    success: false,
    errors: {},
  })
  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex items-center gap-2">
            <div>
              <Leaf className="h-8 w-8 text-emerald-600" />
            </div>
            <Link href="/" className="text-2xl font-bold text-emerald-600">
              Felidae Learn
            </Link>
          </div>

          <div>
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">Masuk ke akun Anda</h2>
            <p className="mt-2 text-sm text-gray-600">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors"
              >
                Daftar sekarang
              </Link>
            </p>
          </div>

          <form action={formAction} className="mt-8 space-y-6">
            <div>
              <Label htmlFor="email">Alamat Email</Label>
              <div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="mt-2"
                />
              </div>
              {state.errors?.email && <p className="text-sm text-red-500 mt-1">{state.errors.email[0]}</p>}
            </div>

            <div>
              <Label htmlFor="password">Kata Sandi</Label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {state.errors?.password && <p className="text-sm text-red-500 mt-1">{state.errors.password[0]}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox id="remember-me" />
                <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Ingat saya
                </Label>
              </div>

              <div className="text-sm">
                <Link
                  href="/reset-password"
                  className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors"
                >
                  Lupa kata sandi?
                </Link>
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? (
                  <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                ) : (
                  "Masuk"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Atau masuk dengan</span>
              </div>
            </div>

            <div className="mt-6">
              {/* <div>
                <Button variant="outline" className="w-full flex items-center justify-center gap-2 hover:bg-gray-50">
                  <Image src="/google.svg" width={20} height={20} alt="Google logo" />
                  <span>Masuk dengan Google</span>
                </Button>
              </div> */}
              <AuthGoogle />
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src="https://res.cloudinary.com/dan5wstbj/image/upload/v1738862644/felidae_ptwlnx.png"
          alt="Felidae background"
          fill
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50 flex items-center justify-center p-6">
          <div className="max-w-md text-center">
            <p className="text-white text-2xl font-bold mb-4">
              &ldquo;Taxonomy is the science of naming, describing and classifying organisms&rdquo;
            </p>
            <p className="text-emerald-400 text-xl">- Carl Linnaeus</p>
          </div>
        </div>
      </div>
    </div>
  )
}

