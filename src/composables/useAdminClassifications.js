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
            link_detail: {
                text: classification.id,
                id: classification.id,
            },
            service_area_name: classification.service_area?.value,
            service_type_name: classification.service_type?.value,
            service_request_1_name: classification.service_request_1?.value,
            service_request_2_name: classification.service_request_2?.value,
            service_request_3_name: classification.service_request_3?.value,
            task_family_name: classification.task_family?.value,
            task_type_name: classification.task_type?.name,
            project_type_name: classification.project_type?.value,
            project_area_name: classification.project_area?.value,
            project_detail_name: classification.project_detail?.value,
            ...classification
        }
    }
    return {
        getClassifications,
    }
}
export default useAdminClassifications