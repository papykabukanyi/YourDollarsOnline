export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full animate-ping opacity-20"></div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          <span className="text-blue-600">Your</span>
          <span className="text-gray-900">Dollars</span>
          <span className="text-green-600">Online</span>
        </h2>
        <p className="text-gray-600">Loading amazing products...</p>
      </div>
    </div>
  );
}
