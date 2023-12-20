import { useConfirm } from "primevue/useconfirm";
import { useFormUtilsStore } from "@/stores/formUtils";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

export function useDialog() {
  const confirm = useConfirm();
  const formUtilsStore = useFormUtilsStore();
  const i18n = useI18n();
  const router = useRouter();

  // TODO: manage close sidebar with the composable
  // const { closeSidebar } = useSidebar();

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

  const confirmNewService = (id) => {
    confirm.require({
      message: i18n.t("service.notification.created.message"),
      header: i18n.t("service.notification.created.header"),
      acceptLabel: i18n.t("service.notification.created.detail"),
      rejectLabel: i18n.t("service.notification.created.list"),
      accept: () => {
        formUtilsStore.goToDetail(id);
      },
      reject: () => {
        formUtilsStore.closeForm();
      },
    });
  };

  const discardNewService = () => {
    confirm.require({
      message: i18n.t("service.notification.discard.message"),
      header: i18n.t("service.notification.discard.header"),
      acceptLabel: i18n.t("service.notification.discard.accept"),
      rejectLabel: i18n.t("service.notification.discard.cancel"),
      accept: () => {
        formUtilsStore.closeForm();
      },
      reject: () => {},
    });
  };

  const cancelService = (id) => {
    confirm.require({
      group: "cancelService",
      header: "ביטול שירות" + id,
      acceptLabel: "ביטול תהליך",
      rejectLabel: "חזור",
      accept: () => {
        formUtilsStore.cancelService(id);
      },
      reject: () => {},
    });
  };

  const completeService = (id) => {
    confirm.require({
      group: "completeService",
      header: "ביטול שירות" + id,
      acceptLabel: "ביטול תהליך",
      rejectLabel: "חזור",
      accept: () => {
        formUtilsStore.completeService(id);
      },
      reject: () => {},
    });
  };

  const confirmNewProject = (id) => {
    confirm.require({
      message: "The new contact was successfully created!",
      header: "New project created",
      acceptLabel: "View project",
      rejectLabel: "View list",
      accept: () => {
        formUtilsStore.goToDetail(id, "project");
        router.push({
          name: "projectDetail",
          params: { id: id },
          force: true,
        });
      },
      reject: () => {
        router.push({
          name: "projects",
          force: true,
        });
      },
    });
  };

  return {
    confirmNewCustomer,
    discardNewCustomer,
    confirmNewContact,
    discardNewContact,
    confirmNewTask,
    discardNewTask,
    confirmNewService,
    discardNewService,
    cancelService,
    completeService,
    confirmNewProject,
  };
}

export default useDialog;
