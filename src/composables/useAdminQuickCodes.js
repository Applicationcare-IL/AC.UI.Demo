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
        return await adminQuickCodes.createQuickCode(params);
    }

    const updateQuickCode = async (quickCodeId, params) => {
        return await adminQuickCodes.updateQuickCode(quickCodeId, params);
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
        };
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
    }
}

export default useAdminFlowmaze;
