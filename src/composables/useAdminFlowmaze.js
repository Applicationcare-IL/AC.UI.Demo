import { useAdminFlowmazeStore } from "@/stores/adminFlowmazeStore";

const useAdminFlowmaze = () => {
  const adminFlowmazeStore = useAdminFlowmazeStore();

  // ACTIONS
  const getScripts = async (params) => {
    const response = await adminFlowmazeStore.getScripts(params);
    const scripts = response.data;
    const totalRecords = response.meta.total;

    return { data: scripts, totalRecords };
  };

  const getScript = async (id) => {
    const response = await adminFlowmazeStore.getScript(id);
    return mapScript(response.data);
  };

  const syncScripts = async () => {
    await adminFlowmazeStore.syncScripts();
  };

  const relateScriptWithEntity = async ({ entityId, scriptId }) => {
    await adminFlowmazeStore.relateScriptWithEntity({
      easymaze_entity_id: entityId,
      flowmaze_script_id: scriptId,
    });
  };

  const updateScriptEntityRelationship = async ({
    entityId,
    scriptId,
    sendEmail,
    emailSubject,
    emailBody,
  }) => {
    await adminFlowmazeStore.updateScriptEntityRelationship({
      easymaze_entity_id: entityId,
      flowmaze_script_id: scriptId,
      send_email: sendEmail,
      email_subject: emailSubject,
      email_body: emailBody,
    });
  };

  const mapScript = (script) => {
    return {
      title: script.name,
      state: {
        value: script.is_active ? "active" : "not_active",
        value_en: script.is_active ? "Active" : "Not Active",
      },
      ...script,
    };
  };

  return {
    // ACTIONS
    getScripts,
    getScript,
    syncScripts,
    relateScriptWithEntity,
    updateScriptEntityRelationship,
    // UTILITIES
    mapScript,
  };
};

export default useAdminFlowmaze;
