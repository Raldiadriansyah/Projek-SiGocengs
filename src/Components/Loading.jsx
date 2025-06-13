export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-white/60 flex flex-col justify-center items-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-blue-600 text-lg">Loading...</p>
    </div>
  );
}