export default function DashboardLoading() {
  return (
    <div className="p-8 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-7 w-32 bg-gray-200 rounded" />
          <div className="h-4 w-48 bg-gray-100 rounded mt-2" />
        </div>
        <div className="h-9 w-28 bg-gray-200 rounded" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="h-4 w-24 bg-gray-100 rounded" />
              <div className="h-5 w-5 bg-gray-100 rounded" />
            </div>
            <div className="h-8 w-12 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-6">
        {[1, 2].map(i => (
          <div key={i} className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="h-5 w-40 bg-gray-200 rounded" />
            </div>
            <div className="p-6 space-y-4">
              {[1, 2, 3].map(j => (
                <div key={j} className="h-12 bg-gray-50 rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
