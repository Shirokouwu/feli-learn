import { supabase } from "../lib/supabase";

/**
 * Script to check and fix species key format in database
 * This will help debug the mismatch between API response and database
 */

async function checkDatabaseKeys() {
    console.log("🔍 Checking database species keys...");

    try {
        // Get all species from database
        const { data: allSpecies, error } = await supabase
            .from("taksonomi_spesies")
            .select("id, nama, nama_umum, kunci")
            .order("nama");

        if (error) {
            console.error("❌ Error fetching species:", error);
            return;
        }

        console.log(`📊 Found ${allSpecies?.length || 0} species in database`);

        // Check for felis margarita specifically
        const felisMargarita = allSpecies?.filter(species =>
            species.kunci?.includes('felis') &&
            species.kunci?.includes('margarita')
        );

        console.log("\n🔍 Felis Margarita matches:");
        felisMargarita?.forEach(species => {
            console.log(`  - ID: ${species.id}`);
            console.log(`  - Name: ${species.nama}`);
            console.log(`  - Common Name: ${species.nama_umum}`);
            console.log(`  - Key: ${species.kunci}`);
            console.log("  ---");
        });

        // Check for keys with hyphens
        const keysWithHyphens = allSpecies?.filter(species =>
            species.kunci?.includes('-')
        );

        console.log(`\n📋 Species with hyphen in key: ${keysWithHyphens?.length || 0}`);
        keysWithHyphens?.slice(0, 10).forEach(species => {
            console.log(`  - ${species.kunci}: ${species.nama || species.nama_umum}`);
        });

        // Check for keys with underscores
        const keysWithUnderscores = allSpecies?.filter(species =>
            species.kunci?.includes('_')
        );

        console.log(`\n📋 Species with underscore in key: ${keysWithUnderscores?.length || 0}`);
        keysWithUnderscores?.slice(0, 10).forEach(species => {
            console.log(`  - ${species.kunci}: ${species.nama || species.nama_umum}`);
        });

        // Sample all keys to see the format
        console.log("\n📋 Sample keys format:");
        allSpecies?.slice(0, 20).forEach(species => {
            console.log(`  - ${species.kunci}: ${species.nama || species.nama_umum}`);
        });

    } catch (error) {
        console.error("❌ Error:", error);
    }
}

/**
 * Function to update keys from hyphen to underscore format
 */
async function fixHyphenKeys() {
    console.log("🔧 Fixing hyphen keys to underscore format...");

    try {
        // Get all species with hyphens in kunci
        const { data: speciesWithHyphens, error: fetchError } = await supabase
            .from("taksonomi_spesies")
            .select("id, kunci")
            .like("kunci", "%-%");

        if (fetchError) {
            console.error("❌ Error fetching species with hyphens:", fetchError);
            return;
        }

        console.log(`Found ${speciesWithHyphens?.length || 0} species with hyphens in key`);

        if (speciesWithHyphens && speciesWithHyphens.length > 0) {
            for (const species of speciesWithHyphens) {
                const newKunci = species.kunci?.replace(/-/g, '_');

                console.log(`Updating: ${species.kunci} → ${newKunci}`);

                const { error: updateError } = await supabase
                    .from("taksonomi_spesies")
                    .update({ kunci: newKunci })
                    .eq("id", species.id);

                if (updateError) {
                    console.error(`❌ Error updating ${species.kunci}:`, updateError);
                } else {
                    console.log(`✅ Updated ${species.kunci} to ${newKunci}`);
                }
            }
        }

    } catch (error) {
        console.error("❌ Error:", error);
    }
}

// Run the check
if (require.main === module) {
    checkDatabaseKeys().then(() => {
        console.log("\n✅ Database check completed");
        process.exit(0);
    });
}

export { checkDatabaseKeys, fixHyphenKeys };
