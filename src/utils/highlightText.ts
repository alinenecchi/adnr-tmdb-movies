import React from "react";

/**
 * Highlights a search term within a text string
 * @param text - The text to search in
 * @param searchTerm - The term to highlight
 * @returns JSX element with highlighted text
 */
export const highlightText = (
  text: string,
  searchTerm: string
): React.ReactNode => {
  if (!searchTerm.trim()) {
    return text;
  }

  const regex = new RegExp(`(${searchTerm})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.toLowerCase() === searchTerm.toLowerCase()) {
      return React.createElement(
        "mark",
        { key: index, className: "highlight" },
        part
      );
    }
    return React.createElement("span", { key: index }, part);
  });
};

