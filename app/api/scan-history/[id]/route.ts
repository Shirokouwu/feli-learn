import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

export async function DELETE(
    // request: Request,
    // { params }: { params: { id: string } }
) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json(
                { error: "User not authenticated" },
                { status: 401 }
            )
        }

        // TODO: Delete specific scan history item from database
        // const supabase = await createClient()
        // const { error } = await supabase
        //   .from("scan_history")
        //   .delete()
        //   .eq("id", params.id)
        //   .eq("user_id", user.id)

        return NextResponse.json({
            message: "Scan history item deleted successfully"
        })

    } catch (error) {
        console.error("Error deleting scan history item:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
