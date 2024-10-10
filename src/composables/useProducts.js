import { useProductsStore } from "@/stores/productsStore";

const useProducts = () => {
  const productsStore = useProductsStore();
  const { formatDateToAPI, formatDateFromAPI } = useDates();

  const getProducts = async (params) => {
    const response = await productsStore.getProducts(params);

    const products = response.data.data.map((product) => mapProduct(product));

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
      throw error;
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
      throw error;
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

  const duplicateProduct = async (id, name) => {
    try {
      return await productsStore.duplicateProduct(id, name);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const newProductVersion = async (id) => {
    try {
      return await productsStore.newProductVersion(id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const activateProduct = async (id) => {
    try {
      return await productsStore.activateProduct(id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deactivateProduct = async (id) => {
    try {
      return await productsStore.deactivateProduct(id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const exportProducts = async (params) => {
    try {
      return await productsStore.exportProducts(params);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // DISCOUNTS
  const getProductDiscounts = async (productId, params) => {
    try {
      const response = await productsStore.getProductDiscounts(productId, params);

      const discounts = response.data.map((discount) => mapProductDiscount(discount));

      const totalRecords = response.meta.total;

      return { data: discounts, totalRecords };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const addProductDiscount = async (productId, params) => {
    try {
      return await productsStore.addProductDiscount(productId, params);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateProductDiscount = async ({ productId, discountId, params }) => {
    try {
      return await productsStore.updateProductDiscount(productId, discountId, params);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteProductDiscount = async (productId, discountId) => {
    try {
      return await productsStore.deleteProductDiscount(productId, discountId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const checkIfDiscountExists = async (productId, quantity) => {
    try {
      const result = await productsStore.checkIfDiscountExists({ productId, quantity });
      return result.data.exists;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // RELATED PRODUCTS
  const getRelatedProducts = async (productId, params) => {
    try {
      const response = await productsStore.getRelatedProducts(productId, params);

      const relatedProducts = response.data.map((relatedProduct) =>
        mapRelatedProduct(relatedProduct)
      );

      return { data: relatedProducts, totalRecords: response.meta.total };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getProductRelationshipTypes = async () => {
    try {
      return await productsStore.getProductRelationshipTypes();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const addRelatedProduct = async (productId, params) => {
    try {
      return await productsStore.addRelatedProduct(productId, params);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const addRelatedProductBulk = async (productId, relationships) => {
    try {
      return await productsStore.addRelatedProductBulk(productId, { relationships });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateRelatedProduct = async (productId, relatedProductId, params) => {
    try {
      return await productsStore.updateRelatedProduct(productId, relatedProductId, params);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteRelatedProduct = async (productId, relatedProductId) => {
    try {
      return await productsStore.deleteRelatedProduct(productId, relatedProductId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // UTILITIES
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
      valid_until: formatDateFromAPI(product.valid_until),
      provisioning_required: product.provisioning_required ? 1 : 0, // the only one who is a boolean
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
      valid_until: formatDateToAPI(product.valid_until),
      income: product.income,
      existing_product: product.existing_product.value ? 1 : 0,
      // NOT FOUND
      purchase: 1,
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

    if (product.service_quick_code) {
      data.service_quick_code = product.service_quick_code.id;
    }

    if (product.maintenance_required) {
      data.maintenance_period = product.maintenance_period;
      data.maintenance_unit = product.maintenance_unit.id;
      data.maintenance_billing_cycle_unit = product.maintenance_billing_cycle_unit.id;
      data.maintenance_billing_cycle_period = product.maintenance_billing_cycle_period.id;
    }

    if (product.discount_type && product.discount_type.value !== "none") {
      data.discount_number = product.amount;
      data.discount_type = product.discount_type.value;
    } else {
      delete data.discount_number;
      delete data.discount_type;
    }

    return data;
  };

  const mapRelatedProduct = (relatedProduct) => {
    return {
      ...relatedProduct.related,
      title: relatedProduct.related.name,
      link_detail: {
        text: relatedProduct.related.name,
        id: relatedProduct.related.id,
      },
      product_image_url: relatedProduct.related.icon
        ? relatedProduct.related.icon.thumbnail + "product"
        : null,
      relationship: {
        id: relatedProduct.type.id,
        name: relatedProduct.type.name,
        label: relatedProduct.type.name,
      },
      render_name_link: {
        text: relatedProduct.related.name,
        id: relatedProduct.related.id,
      },
      render_relation_type: relatedProduct.type.name,
    };
  };

  const mapProductDiscount = (discount) => {
    return {
      ...discount,
      render_discount: {
        quantity: discount.quantity,
        type: discount.discount_type,
      },
    };
  };

  const parseProductDiscount = (discount) => {
    return {
      ...discount,
      discount_number: discount.render_discount.quantity,
    };
  };

  return {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    uploadProductImage,
    duplicateProduct,
    newProductVersion,
    activateProduct,
    deactivateProduct,
    checkIfDiscountExists,
    exportProducts,
    // DISCOUNTS
    getProductDiscounts,
    addProductDiscount,
    updateProductDiscount,
    deleteProductDiscount,
    // RELATED PRODUCTS
    getRelatedProducts,
    getProductRelationshipTypes,
    addRelatedProduct,
    addRelatedProductBulk,
    updateRelatedProduct,
    deleteRelatedProduct,
    // UTILITIES
    parseProduct,
    parseProductDiscount,
  };
};

export default useProducts;
