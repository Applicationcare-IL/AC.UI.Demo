import { useProductsStore } from "@/stores/productsStore";

const useProducts = () => {
  const productsStore = useProductsStore();

  const getProducts = async (params) => {
    const response = await productsStore.getProducts(params);
    const data = response.data;

    return { data: data.data, totalRecords: data.meta.total };
  };

  return {
    getProducts,
  };
};

export default useProducts;
