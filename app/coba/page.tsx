import { createServer } from "@/utils/supabase/server";

export default async function CobaPage() {
  const supabase = await createServer();

  // Ambil semua spesies
  const { data: species, error } = await supabase
    .from("taksonomi_spesies")
    .select("*")
    .order("nama");

  const totalSpecies = species?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Database Spesies Felidae
          </h1>
          <p className="text-xl text-emerald-600 font-semibold">
            Total Spesies: {totalSpecies}
          </p>
          {error && (
            <p className="text-red-600 mt-2">Error: {error.message}</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-emerald-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">No</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Nama Ilmiah</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Nama Umum</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Genus</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {species?.map((sp, index) => (
                <tr key={sp.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 italic">
                    {sp.nama}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {sp.common_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {sp.genus}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${sp.conservation_status === 'Least Concern' ? 'bg-green-100 text-green-800' :
                        sp.conservation_status === 'Near Threatened' ? 'bg-yellow-100 text-yellow-800' :
                          sp.conservation_status === 'Vulnerable' ? 'bg-orange-100 text-orange-800' :
                            sp.conservation_status === 'Endangered' ? 'bg-red-100 text-red-800' :
                              sp.conservation_status === 'Critically Endangered' ? 'bg-red-200 text-red-900' :
                                'bg-gray-100 text-gray-800'
                      }`}>
                      {sp.conservation_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Grouping by First Name */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Kelompok Spesies Berdasarkan Nama Depan
          </h2>
          <div className="space-y-6">
            {Object.entries(
              species?.reduce((acc: Record<string, any[]>, sp) => {
                const firstName = sp.nama?.split(' ')[0] || 'Unknown';
                if (!acc[firstName]) {
                  acc[firstName] = [];
                }
                acc[firstName].push(sp);
                return acc;
              }, {}) || {}
            )
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([firstName, speciesList]) => (
                <div key={firstName} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-emerald-600 text-white px-6 py-3 flex items-center justify-between">
                    <h3 className="text-lg font-bold italic">{firstName}</h3>
                    <span className="bg-white text-emerald-600 px-3 py-1 rounded-full text-sm font-semibold">
                      {speciesList.length} spesies
                    </span>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-2">
                      {speciesList.map((sp) => (
                        <li key={sp.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded hover:bg-gray-100">
                          <div>
                            <span className="font-medium italic text-gray-900">{sp.nama}</span>
                            <span className="text-gray-600 ml-2">({sp.common_name})</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${sp.conservation_status === 'Least Concern' ? 'bg-green-100 text-green-800' :
                              sp.conservation_status === 'Near Threatened' ? 'bg-yellow-100 text-yellow-800' :
                                sp.conservation_status === 'Vulnerable' ? 'bg-orange-100 text-orange-800' :
                                  sp.conservation_status === 'Endangered' ? 'bg-red-100 text-red-800' :
                                    sp.conservation_status === 'Critically Endangered' ? 'bg-red-200 text-red-900' :
                                      'bg-gray-100 text-gray-800'
                            }`}>
                            {sp.conservation_status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}