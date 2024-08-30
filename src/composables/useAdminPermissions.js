import { useAdminPermissionsStore } from "@/stores/adminPermissionsStore";

const usePermissions = () => {
  const adminPermissionsStore = useAdminPermissionsStore();

  const getPermissions = async (entity_type, entity_id) => {
    return await adminPermissionsStore.getPermissions({ entity_type, entity_id });
  };

  const updatePermissions = async (entity_type, entity_id, permissions) => {
    const cleanedPermissions = removeDisabledItems(permissions);

    try {
      return await adminPermissionsStore.updatePermissions({
        entity_type,
        entity_id,
        permissions: cleanedPermissions,
      });
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  };

  const resetEntityPermissions = async (entity_type, entity_id) => {
    try {
      return await adminPermissionsStore.resetEntityPermissions({ entity_type, entity_id });
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  };

  const resetGeneralPermissions = async (entity_type, entity_id) => {
    try {
      return await adminPermissionsStore.resetGeneralPermissions({ entity_type, entity_id });
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  };

  // AUX

  const removeDisabledItems = (obj) => {
    // Crear un nuevo objeto para almacenar los resultados
    const newObj = {};

    // Recorre todas las propiedades del objeto
    for (const key in obj) {
      // Si la propiedad es un objeto, llama recursivamente a la función
      if (typeof obj[key] === "object" && obj[key] !== null) {
        // Si el objeto tiene la propiedad 'disabled' en true, lo ignoramos
        if (obj[key].disabled !== true) {
          // Llamada recursiva para objetos anidados
          const cleanedSubObj = removeDisabledItems(obj[key]);

          // Solo agregar la propiedad si no está vacía
          if (Object.keys(cleanedSubObj).length > 0) {
            newObj[key] = cleanedSubObj;
          }
        }
      } else {
        // Si no es un objeto o no tiene 'disabled', se copia al nuevo objeto
        newObj[key] = obj[key];
      }
    }

    return newObj;
  };

  return {
    getPermissions,
    updatePermissions,
    resetEntityPermissions,
    resetGeneralPermissions,
  };
};

export default usePermissions;
