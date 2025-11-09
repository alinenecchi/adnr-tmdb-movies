import styles from "./Icon.module.css";

export type IconName =
  | "heart"
  | "heart-filled"
  | "star"
  | "search"
  | "trash"
  | "film"
  | "close"
  | "arrow-left"
  | "arrow-right"
  | "menu";

interface IconProps {
  name: IconName;
  size?: "small" | "medium" | "large";
  className?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = "medium",
  className = "",
}) => {
  const icons: Record<IconName, JSX.Element> = {
    heart: (
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    ),
    "heart-filled": (
      <path
        fill="currentColor"
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      />
    ),
    star: (
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    ),
    search: <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm10 2l-5.5-5.5" />,
    trash: (
      <path
        fill="currentColor"
        d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
      />
    ),
    film: (
      <path d="M19.82 2H4.18A2.18 2.18 0 0 0 2 4.18v15.64A2.18 2.18 0 0 0 4.18 22h15.64A2.18 2.18 0 0 0 22 19.82V4.18A2.18 2.18 0 0 0 19.82 2zM7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5" />
    ),
    close: <path d="M18 6L6 18M6 6l12 12" />,
    "arrow-left": <path d="M19 12H5M12 19l-7-7 7-7" />,
    "arrow-right": <path d="M5 12h14M12 5l7 7-7 7" />,
    menu: (
      <path
        d="M3 12h18M3 6h18M3 18h18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  };

  // For filled icons (trash, heart-filled), use fill instead of stroke
  const isFilledIcon = name === "trash" || name === "heart-filled";

  return (
    <svg
      className={`${styles.icon} ${styles[size]} ${className}`}
      viewBox="0 0 24 24"
      fill={isFilledIcon ? "currentColor" : "none"}
      stroke={isFilledIcon ? "none" : "currentColor"}
      strokeWidth={isFilledIcon ? "0" : "2"}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
};
