/**
 * Utility functions for conservation status handling
 */

/**
 * Get appropriate Tailwind CSS classes for conservation status badge
 * @param status - Conservation status string
 * @returns Tailwind CSS classes for the badge
 */
export function getConservationStatusColor(status: string): string {
    if (!status) {
        return "bg-gray-300 text-gray-800 border-gray-400 hover:bg-gray-400 hover:text-white" // Default for unknown status
    }

    const statusLower = status.toLowerCase()

    if (statusLower.includes("extinct") || statusLower.includes("punah")) {
        return "bg-slate-600 text-white border-slate-700 hover:bg-slate-700" // Soft dark gray for extinct
    } else if (
        statusLower.includes("critically") ||
        statusLower.includes("kritis") ||
        statusLower.includes("sangat terancam")
    ) {
        return "bg-rose-400 text-white border-rose-500 hover:bg-rose-500" // Soft rose for critically endangered
    } else if (statusLower.includes("endangered") || statusLower.includes("terancam")) {
        return "bg-red-400 text-white border-red-500 hover:bg-red-500" // Soft red for endangered
    } else if (statusLower.includes("vulnerable") || statusLower.includes("rentan")) {
        return "bg-orange-400 text-white border-orange-500 hover:bg-orange-500" // Soft orange for vulnerable
    } else if (statusLower.includes("near") || statusLower.includes("hampir")) {
        return "bg-amber-400 text-amber-900 border-amber-500 hover:bg-amber-500 hover:text-white" // Soft amber for near threatened
    } else if (statusLower.includes("least") || statusLower.includes("rendah") || statusLower.includes("lc")) {
        return "bg-emerald-400 text-white border-emerald-500 hover:bg-emerald-500" // Soft emerald for least concern
    } else if (statusLower.includes("data") || statusLower.includes("kurang")) {
        return "bg-gray-400 text-white border-gray-500 hover:bg-gray-500" // Soft gray for data deficient
    } else if (statusLower.includes("not") || statusLower.includes("tidak")) {
        return "bg-gray-300 text-gray-800 border-gray-400 hover:bg-gray-400 hover:text-white" // Light soft gray for not evaluated
    } else {
        return "bg-blue-400 text-white border-blue-500 hover:bg-blue-500" // Soft blue as default
    }
}

/**
 * Get hex color value for conservation status (for SVG/Canvas usage)
 * @param status - Conservation status string
 * @returns Hex color value
 */
export function getConservationStatusHexColor(status: string | undefined): string {
    if (!status) return "#67e8f9" // Soft cyan color if no status

    const statusLower = status.toLowerCase()

    if (statusLower.includes("extinct") || statusLower.includes("punah")) {
        return "#4b5563" // Soft dark gray for extinct
    } else if (
        statusLower.includes("critically") ||
        statusLower.includes("kritis") ||
        statusLower.includes("sangat terancam")
    ) {
        return "#f87171" // Soft coral red for critically endangered
    } else if (statusLower.includes("endangered") || statusLower.includes("terancam")) {
        return "#fb7185" // Soft pink-red for endangered
    } else if (statusLower.includes("vulnerable") || statusLower.includes("rentan")) {
        return "#fb923c" // Soft warm orange for vulnerable
    } else if (statusLower.includes("near") || statusLower.includes("hampir")) {
        return "#fbbf24" // Soft golden yellow for near threatened
    } else if (statusLower.includes("least") || statusLower.includes("rendah") || statusLower.includes("lc")) {
        return "#34d399" // Soft emerald green for least concern
    } else if (statusLower.includes("data") || statusLower.includes("kurang")) {
        return "#a1a1aa" // Soft gray for data deficient
    } else if (statusLower.includes("not") || statusLower.includes("tidak")) {
        return "#d1d5db" // Light soft gray for not evaluated
    } else {
        return "#60a5fa" // Soft blue as default
    }
}

/**
 * Get conservation status description in Indonesian
 * @param status - Conservation status string
 * @returns Description of the conservation status
 */
export function getConservationStatusDescription(status: string): string {
    const statusLower = status.toLowerCase()

    if (statusLower.includes("extinct") && !statusLower.includes("wild")) {
        return "Spesies yang tidak lagi diketahui ada di dunia."
    } else if (statusLower.includes("extinct in the wild") || statusLower.includes("punah di alam")) {
        return "Spesies yang hanya diketahui hidup dalam penangkaran atau budidaya, dan tidak lagi ada di alam liar."
    } else if (
        statusLower.includes("critically") ||
        statusLower.includes("kritis") ||
        statusLower.includes("sangat terancam")
    ) {
        return "Spesies yang menghadapi risiko kepunahan yang sangat tinggi di alam liar."
    } else if (statusLower.includes("endangered") || statusLower.includes("terancam")) {
        return "Spesies yang menghadapi risiko kepunahan yang tinggi di alam liar."
    } else if (statusLower.includes("vulnerable") || statusLower.includes("rentan")) {
        return "Spesies yang menghadapi risiko kepunahan yang cukup tinggi di alam liar."
    } else if (statusLower.includes("near") || statusLower.includes("hampir")) {
        return "Spesies yang berada dekat dengan kategori terancam atau rentan."
    } else if (statusLower.includes("least") || statusLower.includes("rendah") || statusLower.includes("lc")) {
        return "Spesies yang tidak memenuhi kriteria untuk kategori terancam dan jumlahnya masih banyak di alam liar."
    } else if (statusLower.includes("data") || statusLower.includes("kurang")) {
        return "Spesies yang tidak cukup informasi tersedia untuk menilai status konservasinya."
    } else if (statusLower.includes("not") || statusLower.includes("tidak")) {
        return "Spesies yang belum dievaluasi oleh IUCN."
    } else {
        return "Status konservasi spesies ini belum diketahui dengan pasti."
    }
}
