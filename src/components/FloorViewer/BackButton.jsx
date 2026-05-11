import './BackButton.css';

export function BackButton({ onClick }) {
  return (
    <button className="back-button" onClick={onClick}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      <span>Back to Building</span>
    </button>
  );
}