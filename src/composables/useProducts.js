import { useProductsStore } from "@/stores/productsStore";

const useProducts = () => {
  const productsStore = useProductsStore();
  const { formatDateToAPI } = useDates();

  const getProducts = async (params) => {
    const response = await productsStore.getProducts(params);

    const products = response.data.data.map((user) => mapProduct(user));

    return { data: products, totalRecords: response.data.meta.total };
  };

  const getProduct = async (id) => {
    const response = await productsStore.getProduct(id);

    return mapProduct(response.data);
  };

  const updateProduct = async (id, params) => {
    try {
      return await productsStore.updateProduct(id, cleanEmptyKeys(params));
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
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

  const uploadProductImage = async (productId, file) => {
    const { uploadAttachment } = useAttachments();

    const formData = new FormData();

    formData.append("file", file);
    formData.append("entity_type", "product");
    formData.append("entity_id", productId);
    formData.append("field", "icon");

    await uploadAttachment(formData)
      .then(({ data }) => {
        return data;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const mapProduct = (product) => {
    return {
      ...product,
      title: product.name,
      link_detail: {
        text: product.name,
        id: product.id,
      },
      product_image_url: product.icon ? product.icon.thumbnail + "product" : null,
      manufacturer_name: product.manufacturer.name,
    };
  };

  const parseProduct = (product) => {
    const today = new Date();

    const data = {
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
      licensing_required: product.licensing_required,
      service_quick_code: product.service_quick_code?.value,
      // NOT FOUND
      purchase: 1,
      income: 1,
      from: formatDateToAPI(today),
      promoted: false,
    };

    if (product.commitment) {
      data.commitment_units = product.commitment_unit.id;
      data.commitment_period = product.commitment_period.id;
    }

    if (product.warranty) {
      data.warranty_units = product.warranty_unit.id;
      data.warranty_period = product.warranty_period.id;
    }

    if (product.installation_required) {
      data.installation_type = product.installation_type.id;
    }

    if (product.provisioning_required) {
      data.provisioning_type = product.provisioning_type.id;
    }

    return data;
  };

  return {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    uploadProductImage,
    // UTILITIES
    parseProduct,
  };
};

export default useProducts;
