export default function RootLoading() {
  return (
    <div className="p-6">
      <div className="animate-pulse grid gap-4">
        <div className="h-8 w-40 bg-gray-200 rounded" />
        <div className="grid md:grid-cols-2 gap-4">
          <div className="h-40 bg-gray-200 rounded" />
          <div className="h-40 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  )
}
