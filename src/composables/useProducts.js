import { useProductsStore } from "@/stores/productsStore";

const useProducts = () => {
  const productsStore = useProductsStore();

  const getProducts = async (params) => {
    const response = await productsStore.getProducts(params);

    const products = response.data.data.map((user) => mapProduct(user));

    return { data: products, totalRecords: response.data.meta.total };
  };

  const getProduct = async () => {
    const response = await productsStore.getProducts();

    const products = response.data.data.map((user) => mapProduct(user));

    return {
      data: products[0],
    };
  };

  const mapProduct = (product) => {
    return {
      ...product,
      title: product.name,
      link_detail: {
        text: product.name,
        id: product.id,
      },
    };
  };

  return {
    getProducts,
    getProduct,
  };
};

export default useProducts;
