// formatTimestamp placeholder
// utils/formatTimestamp.js

export default function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const options = {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  return date.toLocaleString('en-GB', options);
}