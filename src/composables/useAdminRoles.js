import { useAdminRolesStore } from "@/stores/adminRolesStore";

const useAdminFlowmaze = () => {
    const adminRolesStore = useAdminRolesStore();

    const getRoles = async (params) => {
        const response = await adminRolesStore.getRoles(params);
        const roles = response.data.map((role) => mapRole(role));
        const totalRecords = response.meta.total;

        return { data: roles, totalRecords };
    };

    const getRole = async (id) => {
        const response = await adminRolesStore.getRole(id);

        return mapRole(response.data);
    };

    const createRole = async (role) => {
        return await adminRolesStore.createRole(role);
    };

    const updateRole = async (roleId, data) => {
        return await adminRolesStore.updateRole(roleId, data);
    };

    const activateRoles = async (roleIds) => {
        const promises = roleIds.map((roleId) => adminRolesStore.activateRole(roleId));
        return await Promise.all(promises);
    };

    const mapRole = (role) => {
        return{
            ...role,
            link_detail: {
                text: role.id,
                id: role.id,
            },
            title: role.name,
        } 
    };

    const parseRole = (role) => {
        return{
            ...role,
        }
    };

    return{
      // ACTIONS
        getRoles,
        getRole,
        createRole,
        updateRole,
        activateRoles,
      // UTILITIES
        mapRole,
        parseRole,
    };
};

export default useAdminFlowmaze;