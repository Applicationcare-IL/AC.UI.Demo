import { useAdminOptionSetsStore } from "@/stores/adminOptionSetsStore";

const useAdminOptionSets = () => {
  const adminOptionSetsStore = useAdminOptionSetsStore();

  // ACTIONS
  const getOptionSets = async (params) => {
    const response = await adminOptionSetsStore.getOptionSets(params);

    const optionSets = response.data.data.map((optionSet) => mapOptionSet(optionSet));

    return { data: optionSets, totalRecords: response.data.meta.total };
  };

  const addValue = async (parentName, values) => {
    try {
      let params = { parent: parentName, ...values };

      return await adminOptionSetsStore.addValue(params);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const activateOptionSet = async (id) => {
    try {
      return await adminOptionSetsStore.activateOptionSet(id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deactivateOptionSet = async (id) => {
    try {
      return await adminOptionSetsStore.deactivateOptionSet(id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // UTILITIES
  const mapOptionSet = (optionSet) => {
    return { ...optionSet };
  };

  return {
    // ACTIONS
    getOptionSets,
    addValue,
    activateOptionSet,
    deactivateOptionSet,
    // UTILITIES
    mapOptionSet,
  };
};

export default useAdminOptionSets;
