import { useSalesStore } from "@/stores/salesStore";

const useSales = () => {
  const salesStore = useSalesStore();

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
      return await salesStore.createSale(parseSale(params));
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

  const parseSale = (sale) => {
    return {
      // sale,
      customer: sale.customer.id,
      contact: 1274,
      sale_initiator: sale.initiator.id,
      sale_type: sale.sale_type.id,
      sale_source: sale.source.id,
      tender: sale.tender ? 1 : 0,
      tender_publication_date: sale.tender_publication_date,
      tender_question_date: sale.tender_question_date,
      tender_response_date: sale.tender_response_date,
      tender_resolution_date: sale.tender_resolution_date,
      tender_supply_date: sale.tender_supply_date,
      mandatory_requirements: [],
      legal_adviser: sale.legal_adviser.id,
      financial_guide: sale.financial_guide.id,
      sales_manager: sale.sales_manager.id,
      project_manager: sale.projects_manager.id,
      consultant: sale.customer_consultant.id,
      information_technology: sale.information_technology.id,
      business_manager: sale.business_manager.id,
      decision_maker: sale.decision_maker.id,
      budgeting_factor: sale.budgeting_factor.id,
    };
  };

  return {
    // ACTIONS
    getSales,
    getSale,
    createSale,
    updateSale,
    cancelSale,
    // UTILITIES
    parseSale,
  };
};

export default useSales;
