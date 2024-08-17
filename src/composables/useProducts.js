import { useProductsStore } from "@/stores/productsStore";

const useProducts = () => {
  const productsStore = useProductsStore();

  const getProducts = async (params) => {
    const response = await productsStore.getProducts(params);

    const products = response.data.data.map((user) => mapProduct(user));

    return { data: products, totalRecords: response.data.meta.total };
  };

  const mapProduct = (product) => {
    return {
      ...product,
      link_detail: {
        text: product.name,
        id: product.id,
      },
    };
  };

  return {
    getProducts,
  };
};

export default useProducts;
