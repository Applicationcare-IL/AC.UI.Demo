import {useAdminQuickCodesStore} from "@/stores/adminQuickCodes";

const useAdminFlowmaze = () => {
    const adminQuickCodes = useAdminQuickCodesStore();

    const getQuickCodes = async (params) => {
        const response = await adminQuickCodes.getQuickCodes(params);
        const quickCodes = response.data.map((quickCode) => mapQuickCode(quickCode));
        const totalRecords = response.meta.total;

        return {data: quickCodes, totalRecords};
    };

    const getQuickCode = async (id) => {
        const response = await adminQuickCodes.getQuickCode(id);

        return mapQuickCode(response.data);
    }

    const createQuickCode = async (params) => {
        return await adminQuickCodes.createQuickCode(parseQuickCode(params));
    }

    const updateQuickCode = async (quickCodeId, params) => {
        return await adminQuickCodes.updateQuickCode(quickCodeId, parseQuickCode(params));
    }

    const activateQuickCodes = async (quickCodesId) => {
        const promises = quickCodesId.map((quickCodeId) => adminQuickCodes.activateQuickCode(quickCodeId));
        return await Promise.all(promises);
    }

    const deactivateQuickCode = async (quickCodeId) => {
        return await adminQuickCodes.deactivateQuickCode(quickCodeId);
    }

    const mapQuickCode = (quickCode) => {
        return {
            ...quickCode,
            link_detail: {
                text: quickCode.id,
                id: quickCode.id,
            },
            title: quickCode.name,
            service_area_name: quickCode.area?.value,
            service_detail_name: quickCode.type?.value,
            request_1_name: quickCode.request_1?.value,
            request_2_name: quickCode.request_2?.value,
            request_3_name: quickCode.request_3?.value,
            team_name: quickCode.team?.name,
        };
    };

    const parseQuickCode = (quickCode) => {
        return {
            name: quickCode.name,
            area_id: quickCode.service_area.id,
            type_id: quickCode.service_type.id,
            request_1_id: quickCode.service_request_1.id,
            request_2_id: quickCode.service_request_2?.id,
            request_3_id: quickCode.service_request_3?.id,
            team_id: quickCode.team.id,
        }
    };

    return {
        //ACTIONS
        getQuickCodes,
        getQuickCode,
        createQuickCode,
        updateQuickCode,
        activateQuickCodes,
        deactivateQuickCode,
        // UTILITIES
        mapQuickCode,
        parseQuickCode
    }
}

export default useAdminFlowmaze;
