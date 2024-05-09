export function useDates() {
  const parseDate = (date) => {
    if (!date) return null;

    if (typeof date === "object") {
      return date;
    }

    if (date.includes("-")) {
      const dateParts = date.split("-");

      // The date is in the format YYYY-MM-DD
      if (dateParts[0].length === 4) {
        return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      }

      // We assume that the date is in the format MM-DD-YYYY
      return `${dateParts[0]}/${dateParts[1]}/${dateParts[2]}`;
    }

    return date;
  };

  return {
    parseDate,
  };
}
