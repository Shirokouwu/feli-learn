import { createServer } from "@/utils/supabase/server";

export default async function CobaPage() {
    const data = await (await createServer()).from("users").select("*").limit(10);
 
  return (
    <div>
      <h1>Hello Page</h1>
      {JSON.stringify(data)}
    </div>
  );
}