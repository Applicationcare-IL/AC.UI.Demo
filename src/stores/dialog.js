import { useConfirm } from "primevue/useconfirm";
import { useFormUtilsStore } from "@/stores/formUtils";
import { useI18n } from "vue-i18n";

export function useDialog() {
  const confirm = useConfirm();
  const formUtilsStore = useFormUtilsStore();
  const i18n = useI18n();

  const confirmNewCustomer = (id) => {
    confirm.require({
      message: i18n.t("customer.notification.created.message"),
      header: i18n.t("customer.notification.created.header"),
      acceptLabel: i18n.t("customer.notification.created.detail"),
      rejectLabel: i18n.t("customer.notification.created.list"),
      accept: () => {
        formUtilsStore.goToDetail(id);
      },
      reject: () => {
        formUtilsStore.closeForm();
      },
    });
  };

  const confirmUpdateCustomer = (id) => {
    confirm.require({
      message: i18n.t("customer.notification.update.message"),
      header: i18n.t("customer.notification.update.header"),
      acceptLabel: i18n.t("customer.notification.update.detail"),
      rejectLabel: i18n.t("customer.notification.update.list"),
      accept: () => {
        // formUtilsStore.goToDetail(id);
      },
      reject: () => {
        // formUtilsStore.closeForm();
      },
    });
  };

  const discardNewCustomer = () => {
    confirm.require({
      message: i18n.t("customer.notification.discard.message"),
      header: i18n.t("customer.notification.discard.header"),
      acceptLabel: i18n.t("customer.notification.discard.accept"),
      rejectLabel: i18n.t("customer.notification.discard.cancel"),
      accept: () => {
        formUtilsStore.closeForm();
      },
      reject: () => {},
    });
  };

  const confirmNewContact = (id) => {
    confirm.require({
      message: i18n.t("contact.notification.created.message"),
      header: i18n.t("contact.notification.created.header"),
      acceptLabel: i18n.t("contact.notification.created.detail"),
      rejectLabel: i18n.t("contact.notification.created.list"),
      accept: () => {
        formUtilsStore.goToDetail(id);
      },
      reject: () => {
        formUtilsStore.closeForm();
      },
    });
  };

  const discardNewContact = () => {
    confirm.require({
      message: i18n.t("contact.notification.discard.message"),
      header: i18n.t("contact.notification.discard.header"),
      acceptLabel: i18n.t("contact.notification.discard.accept"),
      rejectLabel: i18n.t("contact.notification.discard.cancel"),
      accept: () => {
        formUtilsStore.closeForm();
      },
      reject: () => {},
    });
  };

  const confirmNewTask = (id) => {
    confirm.require({
      message: i18n.t("task.notification.created.message"),
      header: i18n.t("task.notification.created.header"),
      acceptLabel: i18n.t("task.notification.created.detail"),
      rejectLabel: i18n.t("task.notification.created.list"),
      accept: () => {
        formUtilsStore.goToDetail(id, "task");
      },
      reject: () => {
        formUtilsStore.closeForm();
      },
    });
  };

  const discardNewTask = () => {
    confirm.require({
      message: i18n.t("task.notification.discard.message"),
      header: i18n.t("task.notification.discard.header"),
      acceptLabel: i18n.t("task.notification.discard.accept"),
      rejectLabel: i18n.t("task.notification.discard.cancel"),
      accept: () => {
        formUtilsStore.closeForm();
      },
      reject: () => {},
    });
  };

  return {
    confirmNewCustomer,
    discardNewCustomer,
    confirmNewContact,
    discardNewContact,
    confirmNewTask,
    discardNewTask,
  };
}
