import { useUtilsStore } from "@/stores/utils";

export function useUtils() {
  const utilsStore = useUtilsStore();
  const { optionLabelWithLang } = useLanguages();

  const getNextEntityID = async (entity) => {
    const response = await utilsStore.getNextEntityID({
      entity_type: entity,
    });

    return response.data.id;
  };

  /**
   * Format location with the format: City - Street - House_number
   * @param {*} location
   * @returns formated adress
   */
  const formatAddress = (location) => {
    let { city, street, house_number } = location;

    // Check for nulls, becaouse city and street are in an object
    city = city ? city[optionLabelWithLang.value] : null;
    street = street ? street[optionLabelWithLang.value] : null;

    const formattedAddress = [city, street, house_number]
      .filter((value) => value)
      .join(" - ");

    return formattedAddress;
  };

  return {
    getNextEntityID,
    formatAddress,
  };
}
