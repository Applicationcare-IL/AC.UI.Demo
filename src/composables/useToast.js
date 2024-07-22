import { useToast as useToastPrime } from "primevue/usetoast";
import { useI18n } from "vue-i18n";

// eslint-disable-next-line func-style
export function useToast() {
  const toast = useToastPrime();
  const i18n = useI18n();

  const success = ({ title, message, life, group }) => {
    toast.add({
      severity: "success",
      summary: title ? title : i18n.t("toast.success"),
      detail: message,
      life: life ? life : 3000,
      group: group,
    });
  };

  const successAction = (entity, action) => {
    const entityKey = `${entity}.${entity}`;

    toast.add({
      severity: "success",
      summary: i18n.t("toast.success"),
      detail: `${i18n.t(entityKey)} succesfully ${i18n.t(action)}`,
      life: 3000,
    });
  };

  const info = ({ title, message, life, group }) => {
    toast.add({
      severity: "info",
      summary: title ? title : i18n.t("toast.info"),
      detail: message,
      life: life ? life : 3000,
      group: group,
    });
  };

  const warning = (message) => {
    toast.add({
      severity: "warn",
      summary: i18n.t("toast.warning"),
      detail: message,
      life: 3000,
    });
  };

  const error = (message) => {
    toast.add({
      severity: "error",
      summary: i18n.t("toast.error"),
      detail: message,
      life: 3000,
    });
  };

  const showLoadingExportToast = () => {
    toast.add({
      group: "br", // see AppLayout.vue toast with group "br"
      severity: "info",
      summary: i18n.t("toast.export"),
      detail: i18n.t("toast.loading-export-message"),
      closable: false,
    });
  };

  const clearLoadingExportToast = () => {
    toast.removeGroup("br");
  };

  return {
    success,
    successAction,
    info,
    warning,
    error,
    showLoadingExportToast,
    clearLoadingExportToast,
  };
}
