import {useAdminClassificationsStore} from "@/stores/adminClassificationsStores";

const useAdminClassifications = () => {
    const adminClassificationsStore = useAdminClassificationsStore();
    const getClassifications = async (params) => {
        const response = await adminClassificationsStore.getClassifications(params);
        const classifications = response.data.map((classification) => mapClassifications(classification));
        const totalRecords = response.meta.total;

        return {data: classifications, totalRecords};
    };

    const mapClassifications = (classification) => {
        return {
            ...classification
        }
    }
    return {
        getClassifications,
    }
}
export default useAdminClassifications