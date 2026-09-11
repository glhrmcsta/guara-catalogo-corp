export default function SearchBar({ value, onChange, onSubmit }) {
  return (
    <form
      className="search-bar"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit?.()
      }}
    >
      <input
        type="search"
        className="search-bar__input"
        placeholder="Digite aqui o que você procura"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Digite aqui o que você procura"
      />
    </form>
  )
}
