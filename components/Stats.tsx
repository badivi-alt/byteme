export default function Stats({ cards }: { cards: { label: string; value: number | string }[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <div key={i} className="card p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">{c.label}</div>
          <div className="text-2xl font-semibold">{c.value}</div>
        </div>
      ))}
    </div>
  )
}
