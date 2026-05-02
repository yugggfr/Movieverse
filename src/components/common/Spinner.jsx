export function Spinner({ size = "md" }) {
  const s = size === "lg" ? "w-12 h-12" : "w-6 h-6";
  return (
    <div className="flex justify-center items-center py-8">
      <div className={`${s} border-4 border-gray-700 border-t-amber-500 rounded-full animate-spin`} />
    </div>
  );
}
