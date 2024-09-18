import { useSalesStore } from "@/stores/salesStore";

const useSales = () => {
  const salesStore = useSalesStore;

  const getSales = async (params) => {
    const response = await salesStore.getSales(params);

    const sales = response.data.data.map((sale) => mapSale(sale));

    return { data: sales, totalRecords: response.data.meta.total };
  };

  const getSale = async (id) => {
    const response = await salesStore.getSale(id);

    return mapSale(response.data);
  };

  const createSale = async (params) => {
    try {
      return await salesStore.createProduct(params);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateSale = async (id, params) => {
    try {
      return await salesStore.updateSale(id, params);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const cancelSale = async (id) => {
    try {
      return await salesStore.cancelSale(id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const mapSale = (sale) => {
    return {
      ...sale,
    };
  };

  return {
    getSales,
    getSale,
    createSale,
    updateSale,
    cancelSale,
  };
};

export default useSales;
