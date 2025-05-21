// 'use server'

// import { cookies } from 'next/headers'

// export async function trackSpeciesView(speciesId: string | number) {
//     try {
//         // You can directly access your database here without going through an API
//         // For example with Prisma:
//         // await prisma.speciesViews.create({
//         //   data: {
//         //     speciesId,
//         //     timestamp: new Date(),
//         //     // You can add user identification from cookies if needed
//         //   }
//         // });

//         // Or if you still need to call an external API:
//         const response = await fetch(`${process.env.SITE_URL}/api/track-click`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 id: speciesId,
//                 type: 'species',
//             }),
//             // This ensures the request is made from the server
//             cache: 'no-store',
//         })

//         if (!response.ok) {
//             throw new Error('Failed to track species view')
//         }

//         // You could store a cookie to prevent multiple tracking of the same species
//         const cookieStore = await cookies()
//         cookieStore.set(`viewed-species-${speciesId}`, 'true', {
//             maxAge: 60 * 60 * 24, // 24 hours
//             path: '/',
//         })

//         return { success: true }
//     } catch (error) {
//         console.error('Error tracking species view:', error)
//         return { success: false, error }
//     }
// }