export function TaxonomyLoading() {
    return (
        <div className="h-full flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4" />
                <p className="text-neutral-600">Loading taxonomy data...</p>
            </div>
        </div>
    )
}
