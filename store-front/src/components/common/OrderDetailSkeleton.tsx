export function OrderDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="bg-white rounded-lg shadow p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-3 bg-gray-200 rounded w-24"></div>
        <div className="h-3 bg-gray-200 rounded w-40"></div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex gap-3 border-b last:border-none pb-3">
            <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
            <div className="flex flex-col flex-grow justify-between">
              <div className="h-4 bg-gray-200 rounded w-40"></div>
              <div className="h-3 bg-gray-200 rounded w-24 mt-2"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-10"></div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-4 space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-3 bg-gray-200 rounded w-20"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
