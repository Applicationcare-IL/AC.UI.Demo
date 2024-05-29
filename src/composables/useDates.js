import { format, parse } from "@formkit/tempo";

export function useDates() {
  const FRONTEND_DATE_FORMAT = "DD/MM/YYYY";
  const BACKEND_SEND_DATE_FORMAT = "YYYY-MM-DD";

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

    const dateISO = `${year}-${month < 10 ? "0" : ""}${month}-${day < 10 ? "0" : ""}${day}`;

    return dateISO;
  }

  function formatDateFromAPI(date) {
    return format(date, FRONTEND_DATE_FORMAT);
  }

  function formatDateToAPI(date) {
    if (typeof date === "object") {
      return format(date, BACKEND_SEND_DATE_FORMAT);
    }

    return format(parse(date, FRONTEND_DATE_FORMAT), BACKEND_SEND_DATE_FORMAT);
  }

  return {
    parseDate,
    formatDate,
    formatDateFromAPI,
    formatDateToAPI,
  };
}
