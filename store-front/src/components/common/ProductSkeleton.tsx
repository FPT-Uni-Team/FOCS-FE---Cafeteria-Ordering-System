const ProductSkeleton = () => (
  <div className="animate-pulse flex bg-gray-100 rounded-lg overflow-hidden p-2 gap-3">
    <div className="w-28 h-28 bg-gray-300 rounded-md" />
    <div className="flex flex-col justify-between flex-1 py-1">
      <div className="space-y-2">
        <div className="w-2/3 h-4 bg-gray-300 rounded" />
        <div className="w-1/2 h-3 bg-gray-300 rounded" />
      </div>
      <div className="w-1/3 h-4 bg-gray-300 rounded" />
    </div>
  </div>
);

export default ProductSkeleton;
