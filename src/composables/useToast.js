import { useToast as useToastPrime } from "primevue/usetoast";
import { useI18n } from "vue-i18n";

export function useToast() {
  const toast = useToastPrime();
  const i18n = useI18n();
  const success = (message) => {
    toast.add({
      severity: "success",
      summary: i18n.t("toast.success"),
      detail: message,
      life: 3000,
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

  const info = (message) => {
    toast.add({
      severity: "info",
      summary: i18n.t("toast.info"),
      detail: message,
      life: 3000,
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

  return { success, successAction, info, warning, error };
}
