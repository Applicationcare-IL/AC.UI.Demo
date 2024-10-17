import { useSalesStore } from "@/stores/salesStore";

const useSales = () => {
  const salesStore = useSalesStore();
  const { optionLabelWithLang } = useLanguages();
  const { formatDateFromAPI, formatDateToAPI } = useDates();

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

  const orderSaleProducts = async (saleId, productIds) => {
    try {
      return await salesStore.orderSaleProducts(saleId, { product_ids: productIds });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // CUSTOMER OWNED PRODUCTS
  const getSaleCustomerProducts = async (customerId, params) => {
    const response = await salesStore.getSaleCustomerProducts({
      customer: customerId,
      ...Object.fromEntries(params),
    });

    const sales = response.data.data.map((sale) => mapCustomerSaleProduct(sale));

    return { data: sales, totalRecords: response.data.meta.total };
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

      render_sla: {
        sla: sale.process.sla.sla,
        days_for_closing: sale.process.sla.days_for_closing,
        state: sale.state.value,
      },

      render_current_stage: sale.process.current_stage.name,

      render_sale_type: sale.sale_type[optionLabelWithLang.value],
      render_sale_source: sale.sale_source[optionLabelWithLang.value],
      render_initiator: sale.sale_initiator[optionLabelWithLang.value],

      render_owner: sale.owner.name,
      render_waiting_customers: sale.waiting_for_customers,
      render_open_tasks: sale.open_tasks,
      render_breached_tasks: sale.breached_tasks,
      render_price_base: sale.deal_price_base,

      start_date: sale.process.opened,
      end_date: sale.process.due_date,

      render_price_final: sale.deal_price_final,
      last_change_date: sale.last_activity?.updater.at ?? sale.last_activity?.creator.at,

      render_tender: sale.tender,
      tender_publication_date: sale.tender_publication_date
        ? formatDateFromAPI(sale.tender_publication_date)
        : "",
      tender_question_date: sale.tender_question_date
        ? formatDateFromAPI(sale.tender_question_date)
        : "",

      tender_resolution_date: sale.tender_resolution_date
        ? formatDateFromAPI(sale.tender_resolution_date)
        : "",
      tender_response_date: sale.tender_response_date
        ? formatDateFromAPI(sale.tender_response_date)
        : "",
      tender_supply_date: sale.tender_supply_date ? formatDateFromAPI(sale.tender_supply_date) : "",
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

  const mapCustomerSaleProduct = (sale) => {
    return {
      ...sale,
      link_detail: {
        text: sale.product.name,
        id: sale.product.id,
      },
      render_type: sale.product.type,
      render_family: sale.product.family,
      render_group: sale.product.group,
      render_department: sale.product.department,
    };
  };

  const parseSale = (sale) => {
    const parsedSale = {
      budget: sale.budget ?? 0,
      budgeting_factor: sale.budgeting_factor?.id,
      business_manager: sale.business_manager?.id,
      consultant: sale.consultant?.id,
      contact: sale.contact.id,
      customer: sale.customer.id,
      decision_maker: sale.decision_maker?.id,
      financial_guide: sale.financial_guide.id,
      information_technology: sale.information_technology?.id,
      legal_adviser: sale.legal_adviser.id,
      mandatory_requirements: sale.mandatory_requirements?.map((item) => item.item),
      project_manager: sale.project_manager?.id,
      remarks: sale.remarks ?? "",
      sale_initiator: sale.initiator.id,
      sale_source: sale.source.id,
      sale_type: sale.sale_type.id,
      sales_manager: sale.sales_manager.id,
      tender: sale.tender ? 1 : 0,
      waiting_for_customer: sale.waiting_for_customer,
    };

    if (sale.tender_publication_date) {
      parsedSale.tender_publication_date = formatDateToAPI(sale.tender_publication_date);
    }

    if (sale.tender_question_date) {
      parsedSale.tender_question_date = formatDateToAPI(sale.tender_question_date);
    }

    if (sale.tender_resolution_date) {
      parsedSale.tender_resolution_date = formatDateToAPI(sale.tender_resolution_date);
    }

    if (sale.tender_response_date) {
      parsedSale.tender_response_date = formatDateToAPI(sale.tender_response_date);
    }

    if (sale.tender_supply_date) {
      parsedSale.tender_supply_date = formatDateToAPI(sale.tender_supply_date);
    }

    return parsedSale;
  };

  const parseOfferedProduct = (product) => {
    return {
      quantity: product.quantity,
      status: product.status.id,
      salesman_discount: product.salesman_discount,
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
    orderSaleProducts,
    getSaleCustomerProducts,
    // UTILITIES
    parseSale,
    parseOfferedProduct,
  };
};

export default useSales;
