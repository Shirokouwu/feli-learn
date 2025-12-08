import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { createServer } from "@/utils/supabase/server";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// GET: Fetch per-user scan stats
export async function GET() {
    try {
        const supabase = await createServer();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized - Please login to view your stats" },
                { status: 401 }
            );
        }

        const today = format(new Date(), "yyyy-MM-dd", { locale: id });
        const userTodayKey = `scan:user:${user.id}:today:${today}`;
        const userTotalKey = `scan:user:${user.id}:total`;

        console.log(`[User Stats] GET request at ${new Date().toISOString()} - User: ${user.id}`);

        const [todayScans, totalScans] = await redis.mget<number[]>([userTodayKey, userTotalKey]);

        const response = {
            todayScans: todayScans || 0,
            totalScans: totalScans || 0,
            userId: user.id,
        };

        console.log(`[User Stats] GET response:`, response);

        return NextResponse.json(response);
    } catch (error) {
        console.error(`[User Stats] GET error:`, error);
        return NextResponse.json(
            { error: "Failed to fetch user scan stats" },
            { status: 500 }
        );
    }
}
