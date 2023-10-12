export function ErrorMessage({ message }) {
  return message && <span className="text-red-500 text-xs mb-3 pt-1">{message}</span>
}
