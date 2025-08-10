import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET() {
    const todayKey = `scan:today:${format(new Date(), "yyyy-MM-dd", { locale: id })}`;
    const totalKey = "scan:total";

    const [todayScans, totalScans] = await redis.mget<number[]>([todayKey, totalKey]);

    return NextResponse.json({
        todayScans: todayScans || 0,
        totalScans: totalScans || 0,
    });
}

export async function POST() {
    const todayKey = `scan:today:${format(new Date(), "yyyy-MM-dd", { locale: id })}`;
    const totalKey = "scan:total";

    await redis.incr(todayKey);
    await redis.incr(totalKey);

    return NextResponse.json({ message: "Scan recorded" });
}
