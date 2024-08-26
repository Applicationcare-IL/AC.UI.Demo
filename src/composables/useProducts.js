import { useProductsStore } from "@/stores/productsStore";

const useProducts = () => {
  const productsStore = useProductsStore();
  const { formatDateToAPI } = useDates();

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

  const cleanEmptyKeys = (obj) => {
    // Recorremos cada clave en el objeto
    for (let key in obj) {
      // Si el valor es un objeto, llamamos recursivamente a la función
      if (typeof obj[key] === "object" && obj[key] !== null) {
        cleanEmptyKeys(obj[key]);
      }

      // Si el valor está vacío (cadena vacía, null, undefined, array vacío), lo eliminamos
      if (
        obj[key] === "" ||
        obj[key] === null ||
        obj[key] === undefined ||
        (Array.isArray(obj[key]) && obj[key].length === 0) ||
        (typeof obj[key] === "object" && Object.keys(obj[key]).length === 0)
      ) {
        delete obj[key];
      }
    }

    return obj;
  };

  const createProduct = async (params) => {
    try {
      return await productsStore.createProduct(cleanEmptyKeys(params));
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
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

  const parseProduct = (product) => {
    console.log("parseProduct", product);
    const today = new Date();

    return {
      ...product,
      billing_type: product.billing_type.id,
      units: product.units.id,
      manufacturer: product.manufacturer.value,
      manufacturer_type: product.manufacturer_type.id,
      technical_manager: product.technical_manager.value,
      marketing_manager: product.marketing_manager.value,
      product_type: product.product_type.id,
      product_family: product.product_family.id,
      product_group: product.product_group.id,
      product_department: product.product_department.id,
      cancellation_type: product.cancellation_type.id,
      renewal_type: product.renewal_type.id,
      // NOT FOUND
      purchase: 1,
      income: 1,
      from: formatDateToAPI(today),
    };
  };

  return {
    getProducts,
    getProduct,
    createProduct,
    // UTILITIES
    parseProduct,
  };
};

export default useProducts;
