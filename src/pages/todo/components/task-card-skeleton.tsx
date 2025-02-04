export default function TaskCardSkeleton() {
  return (
    <div
      role="status"
      className="w-full px-3 py-2 rounded-lg border mb-3 animate-pulse"
    >
      <div>
        <div className="h-5 bg-gray-200 rounded dark:bg-gray-700 w-1/3 mb-4"></div>
        <div className="h-2.5 bg-gray-200 rounded dark:bg-gray-700 w-full mb-2"></div>
        <div className="h-2.5 bg-gray-200 rounded dark:bg-gray-700 w-full mb-2"></div>
        <div className="h-2.5 bg-gray-200 rounded dark:bg-gray-700 w-1/2 mb-2"></div>
      </div>
    </div>
  );
}
