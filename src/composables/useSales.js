import { useSalesStore } from "@/stores/salesStore";

const useSales = () => {
  const salesStore = useSalesStore();
  const { optionLabelWithLang } = useLanguages();

  const getSales = async (params) => {
    const response = await salesStore.getSales(params);

    const sales = response.data.data.map((sale) => mapSale(sale));

    return { data: sales, totalRecords: response.data.meta.total };
  };

  const getSale = async (id) => {
    const response = await salesStore.getSale(id);

    return mapSale(response.data);
  };

  const createSale = async (data) => {
    try {
      return await salesStore.createSale(data);
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

  // SALE AND OFFERED PRODUCTS
  const getSaleProducts = async (id, params) => {
    const response = await salesStore.getSaleProducts(id, params);

    const sales = response.data.data.map((sale) => mapSaleProduct(sale));

    return { data: sales, totalRecords: response.data.meta.total };
  };

  const createOfferedProducts = async (saleId, productIds) => {
    try {
      return await salesStore.createOfferedProducts(saleId, productIds);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateOfferedProduct = async (saleId, productId, params) => {
    try {
      return await salesStore.updateOfferedProduct(saleId, productId, params);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // UTILITIES
  const mapSale = (sale) => {
    return {
      ...sale,
      link_detail: {
        text: sale.id,
        id: sale.id,
      },
      render_contact: {
        text: sale.contact.name,
        id: sale.id,
      },
      render_customer: {
        text: sale.customer.name,
        id: sale.id,
      },
      render_sale_type: sale.sale_type[optionLabelWithLang.value],
      render_sale_source: sale.sale_source[optionLabelWithLang.value],
      render_tender: sale.tender,
      render_initiator: sale.sale_initiator[optionLabelWithLang.value],

      render_owner: sale.owner.name,
      render_waiting_customers: sale.waiting_for_customers,
      render_open_tasks: sale.open_tasks,
      render_breached_tasks: sale.breached_tasks,
      render_price_base: sale.deal_price_base,

      render_price_final: sale.deal_price_final,
    };
  };

  const mapSaleProduct = (sale) => {
    return {
      ...sale,
      link_detail: {
        text: sale.product.name,
        id: sale.product.id,
      },
    };
  };

  const parseSale = (sale) => {
    return {
      customer: sale.customer.id,
      contact: sale.contact.id,
      sale_initiator: sale.initiator.id,
      sale_type: sale.sale_type.id,
      sale_source: sale.source.id,
      tender: sale.tender ? 1 : 0,
      tender_publication_date: sale.tender_publication_date,
      tender_question_date: sale.tender_question_date,
      tender_response_date: sale.tender_response_date,
      tender_resolution_date: sale.tender_resolution_date,
      tender_supply_date: sale.tender_supply_date,
      mandatory_requirements: sale.mandatory_requirements?.map((item) => item.item),
      legal_adviser: sale.legal_adviser.id,
      financial_guide: sale.financial_guide.id,
      sales_manager: sale.sales_manager.id,
      project_manager: sale.project_manager?.id,
      consultant: sale.consultant?.id,
      information_technology: sale.information_technology?.id,
      business_manager: sale.business_manager?.id,
      decision_maker: sale.decision_maker?.id,
      budgeting_factor: sale.budgeting_factor?.id,
      budget: sale.budget ?? 0,
      waiting_for_customer: sale.waiting_for_customer,
    };
  };

  const parseOfferedProduct = (product) => {
    return {
      quantity: product.quantity,
      status: product.status.id,
    };
  };

  return {
    // ACTIONS
    getSales,
    getSale,
    createSale,
    updateSale,
    cancelSale,
    getSaleProducts,
    createOfferedProducts,
    updateOfferedProduct,
    // UTILITIES
    parseSale,
    parseOfferedProduct,
  };
};

export default useSales;
