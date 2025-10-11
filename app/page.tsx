import { Button } from "@/components/ui/button";
import { createServer } from "@/utils/supabase/server";
import Image from "next/image";
import { signOut } from "./(auth)/_action";
import Link from "next/link";
import SignOutButton from "@/components/auth/SignOutButton";

export default async function Home() {
  const supabase = await createServer();

  const { data: { user } } = await supabase.auth.getUser();

  function getGreeting() {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 11) return "Selamat Pagi 🌅";
    if (hour >= 11 && hour < 15) return "Selamat Siang ☀️";
    if (hour >= 15 && hour < 18) return "Selamat Sore 🌇";
    if (hour >= 18 && hour < 24) return "Selamat Malam 🌙";
    return "Selamat Tengah Malam 🌌"; // jam 0 - 4
  }


  console.log("user", user);

  if (user) {
    const avatarUrl = user.user_metadata.avatar_url || user.user_metadata.picture;

    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          {/* Profile Card */}
          <div className="flex flex-col md:flex-row items-center md:items-stretch gap-6 border-2 border-black p-6 shadow-[8px_8px_0_#111] rounded-none bg-white">
            <div className="flex items-center gap-4 md:border-r-2 md:border-black md:pr-6">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="User Avatar"
                  className="w-24 h-24 rounded-full border-2 border-black shadow-[4px_4px_0_#111] object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-emerald-300 border-2 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0_#111]">
                  <span className="text-black text-2xl font-bold">
                    {user.user_metadata.full_name?.charAt(0) || "U"}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-extrabold">{getGreeting()}</h1>
                <p className="text-neutral-700 font-medium">{user.user_metadata.full_name}</p>
                <p className="text-neutral-500 text-sm">Welcome back 👋</p>
              </div>
            </div>
            <div className="flex-1 flex items-center md:justify-end">
              <SignOutButton
                action={signOut}
                className="bg-emerald-500 text-white border-2 border-black rounded-none shadow-[4px_4px_0_#111] hover:translate-x-[-2px] hover:translate-y-[-2px]"
              />
            </div>
          </div>

          {/* Quick Nav */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { href: "/scanner", label: "Scanner", emoji: "🔍" },
              { href: "/radial", label: "Radial", emoji: "🌀" },
              { href: "/database", label: "Database", emoji: "🗄️" },
              { href: "/profile", label: "Profile", emoji: "👤" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block border-2 border-black bg-white p-5 text-center font-semibold shadow-[6px_6px_0_#111] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
              >
                <div className="text-2xl mb-1">{item.emoji}</div>
                <div className="text-neutral-900">{item.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Hero */}
        <div className="text-center">
          <span className="inline-block mb-3 bg-emerald-300 text-black border-2 border-black px-3 py-1 text-xs md:text-sm uppercase tracking-wide rounded-none">Felidae Learn</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900">Belajar Felidae dengan Cara yang Jelas</h1>
          <p className="mt-3 text-neutral-600 max-w-2xl mx-auto">Database, visualisasi taksonomi, dan alat bantu belajar untuk memahami keluarga Felidae.</p>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/database"
            className="bg-emerald-500 text-white border-2 border-black rounded-none shadow-[4px_4px_0_#111] px-5 py-3 font-semibold hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
          >
            Mulai dari Database
          </Link>
          <Link
            href="/radial"
            className="bg-white border-2 border-black rounded-none shadow-[4px_4px_0_#111] px-5 py-3 font-semibold hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
          >
            Lihat Struktur Taksonomi
          </Link>
          <Link
            href="/scanner"
            className="bg-white border-2 border-black rounded-none shadow-[4px_4px_0_#111] px-5 py-3 font-semibold hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
          >
            Coba Scanner
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { href: "/scanner", label: "Scanner", emoji: "🔍" },
            { href: "/radial", label: "Radial", emoji: "🌀" },
            { href: "/database", label: "Database", emoji: "🗄️" },
            { href: "/profile", label: "Profile", emoji: "👤" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block border-2 border-black bg-white p-5 text-center font-semibold shadow-[6px_6px_0_#111] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
            >
              <div className="text-2xl mb-1">{item.emoji}</div>
              <div className="text-neutral-900">{item.label}</div>
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/login"
            className="bg-emerald-500 text-white border-2 border-black rounded-none shadow-[4px_4px_0_#111] px-5 py-3 font-semibold hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-white border-2 border-black rounded-none shadow-[4px_4px_0_#111] px-5 py-3 font-semibold hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
          >
            Register
          </Link>
        </div>

        <footer className="mt-10 text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} Felidae. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
