interface TagListProps {
  items: string[]
}

export function TagList({ items }: TagListProps) {
  return (
    <ul className="tag-list" aria-label="Technologies used">
      {items.map((item) => (
        <li key={item} className="tag-list__item">
          {item}
        </li>
      ))}
    </ul>
  )
}
