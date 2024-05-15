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

  function formatDate(date) {
    const newDate = new Date(date);

    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1; // Note: months are 0-based
    const day = newDate.getDate();

    const dateISO = `${year}-${month < 10 ? "0" : ""}${month}-${
      day < 10 ? "0" : ""
    }${day}`;

    return dateISO;
  }

  return {
    parseDate,
    formatDate,
  };
}
