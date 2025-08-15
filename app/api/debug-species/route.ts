import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
    try {
        const { action, species_key } = await request.json();

        if (action === 'check_felis_margarita') {
            // Check for felis margarita with different formats
            const checks = [
                'felis-margarita',
                'felis_margarita',
                'felis margarita'
            ];

            const results: any = {};

            for (const key of checks) {
                const { data, error } = await supabase
                    .from("taksonomi_spesies")
                    .select("id, nama, nama_umum, kunci")
                    .eq("kunci", key);

                results[key] = { data, error: error?.message };
            }

            // Also try partial matches
            const { data: partialMatches, error: partialError } = await supabase
                .from("taksonomi_spesies")
                .select("id, nama, nama_umum, kunci")
                .ilike("kunci", "%felis%")
                .ilike("kunci", "%margarita%");

            results['partial_matches'] = { data: partialMatches, error: partialError?.message };

            // Get all keys to see the format
            const { data: allKeys, error: allKeysError } = await supabase
                .from("taksonomi_spesies")
                .select("kunci")
                .limit(50);

            results['sample_keys'] = { data: allKeys?.map(item => item.kunci), error: allKeysError?.message };

            return NextResponse.json({
                success: true,
                results,
                message: 'Database check completed'
            });
        }

        if (action === 'search_species' && species_key) {
            // Search for a specific species key
            const originalKey = species_key;
            const normalizedKey = species_key.replace(/-/g, '_');

            const { data: originalResult, error: originalError } = await supabase
                .from("taksonomi_spesies")
                .select("*")
                .eq("kunci", originalKey)
                .single();

            const { data: normalizedResult, error: normalizedError } = await supabase
                .from("taksonomi_spesies")
                .select("*")
                .eq("kunci", normalizedKey)
                .single();

            return NextResponse.json({
                success: true,
                originalKey,
                normalizedKey,
                originalResult: { data: originalResult, error: originalError?.message },
                normalizedResult: { data: normalizedResult, error: normalizedError?.message }
            });
        }

        return NextResponse.json({
            success: false,
            message: 'Invalid action'
        }, { status: 400 });

    } catch (error) {
        console.error('Debug API error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
