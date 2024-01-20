import { storeToRefs } from "pinia";

import { useUtilsStore } from "@/stores/utils";

export function useUtils() {
  const utilsStore = useUtilsStore();
  const { optionLabelWithLang } = useLanguages();

  const { entity } = storeToRefs(utilsStore);

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

  const formatCityData = (location) => {
    if (!location.block || !location.parcel || !location.sub_parcel) {
      return false;
    }

    const { block, parcel, sub_parcel } = location;
    const formattedLocation = [block, parcel, sub_parcel]
      .filter((value) => value)
      .join(" - ");

    return formattedLocation;
  };

  function getValueOf(obj, reference) {
    // Dividir la cadena de referencia en partes
    const keys = reference.split(".");

    // Iniciar la búsqueda desde el objeto proporcionado
    let result = obj;

    // Iterar a través de las partes de la referencia
    for (const key of keys) {
      // Verificar si la clave actual existe en el objeto
      if (result && result.hasOwnProperty(key)) {
        // Actualizar el resultado con la propiedad actual
        result = result[key];
      } else {
        // Devolver undefined si la clave no existe
        return undefined;
      }
    }

    // Devolver el resultado final
    return result;
  }

  return {
    getNextEntityID,
    formatAddress,
    formatCityData,
    getValueOf,
    currentEntity: entity,
  };
}
