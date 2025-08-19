import { Button } from "@/components/ui/button";
import { createServer } from "@/utils/supabase/server";
import Image from "next/image";
import { signOut } from "./(auth)/_action";
import Link from "next/link";

export default async function Home() {
  const supabase = await createServer();

  const { data: { user } } = await supabase.auth.getUser();

  console.log("user", user);

  if (user) {
    const avatarUrl = user.user_metadata.avatar_url || user.user_metadata.picture;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8">
        {/* Profile Section */}
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="User Avatar"
              width={100}
              height={100}
              className="rounded-full"
            />
          ) : (
            <div className="w-[100px] h-[100px] bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-xl">
                {user.user_metadata.full_name?.charAt(0) || "U"}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {user.user_metadata.full_name}
            </h1>
          </div>
          <form>
            <Button type="submit" formAction={signOut} className="ml-4">
              Sign Out
            </Button>
          </form>
        </div>

        {/* Navigation */}
        <nav className="flex gap-6 text-lg font-medium">
          <Link href="/scanner" className="hover:text-blue-500">
            🔍 Scanner
          </Link>
          <Link href="/radial" className="hover:text-blue-500">
            🌀 Radial
          </Link>
          <Link href="/profile" className="hover:text-blue-500">
            👤 Profile
          </Link>
        </nav>
      </div>
    );
  }


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Navigation */}
      <nav className="flex gap-6 text-lg font-medium">
        <Link href="/scanner" className="hover:text-blue-500">
          🔍 Scanner
        </Link>
        <Link href="/radial" className="hover:text-blue-500">
          🌀 Radial
        </Link>
        <Link href="/profile" className="hover:text-blue-500">
          👤 Profile
        </Link>
      </nav>
      <main className="flex flex-col gap-8 row-start-2 items-center text-center">
        {/* Judul Utama */}
        <h1 className="text-4xl font-bold">Selamat Datang di Felidae 🐾</h1>
        <p className="text-gray-600 text-lg max-w-md">
          Platform untuk memulai perjalananmu bersama Felidae.
        </p>

        {/* Navigasi Login / Register */}
        <div className="flex gap-6 mt-6">
          <Link
            href="/login"
            className="rounded-full bg-blue-600 text-white px-6 py-3 font-medium hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-blue-600 text-blue-600 px-6 py-3 font-medium hover:bg-blue-50 transition"
          >
            Register
          </Link>
        </div>
      </main>

      <footer className="row-start-3 text-sm text-gray-500">
        © {new Date().getFullYear()} Felidae. All rights reserved.
      </footer>
    </div>
  );
}
