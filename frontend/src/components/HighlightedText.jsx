function HighlightedText({
  text = "",
  keywords = [],
  riskLevel = "low",
}) {
  if (!text) return null;

  const getColorClass = (level) => {
    switch (level) {
      case "high":
        return "risk-high";
      case "medium":
        return "risk-medium";
      default:
        return "risk-low";
    }
  };

  const escapeRegex = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  let highlightedText = text;

  if (Array.isArray(keywords) && keywords.length > 0) {
    keywords.forEach((keyword) => {
      if (!keyword || keyword.trim() === "") return;

      const escapedKeyword = escapeRegex(keyword);

      const regex = new RegExp(`(${escapedKeyword})`, "gi");

      highlightedText = highlightedText.replace(
        regex,
        `<span class="${getColorClass(riskLevel)}">$1</span>`
      );
    });
  }

  return (
    <span
      dangerouslySetInnerHTML={{
        __html: highlightedText,
      }}
    />
  );
}

export default HighlightedText;