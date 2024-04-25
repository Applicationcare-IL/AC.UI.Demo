export function useDates() {
  const parseDate = (date) => {
    if (!date) return null;

    if (typeof date === "object") {
      return date;
    }

    if (date.includes("-")) {
      const dateParts = date.split("-");

      return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    }

    return date;
  };

  return {
    parseDate,
  };
}
