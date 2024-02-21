import { useConfirm } from "primevue/useconfirm";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import { useFormUtilsStore } from "@/stores/formUtils";

export function useDialog() {
  const confirm = useConfirm();
  const formUtilsStore = useFormUtilsStore();
  const i18n = useI18n();
  const router = useRouter();

  const { currentEntity } = useUtils();

  const confirmNewCustomer = (id) => {
    confirm.require({
      message: i18n.t("customer.notification-created-message"),
      header: i18n.t("customer.notification-created-header"),
      acceptLabel: i18n.t("customer.notification-created-detail"),
      rejectLabel: i18n.t("customer.notification-created-close"),
      accept: () => {
        formUtilsStore.goToDetail(id);
      },
      reject: () => {
        formUtilsStore.closeForm();
      },
    });
  };

  const confirmNewContact = (id) => {
    confirm.require({
      message: i18n.t("contact.notification-created-message"),
      header: i18n.t("contact.notification-created-header"),
      acceptLabel: i18n.t("contact.notification-created-detail"),
      rejectLabel: i18n.t("contact.notification-created-close"),
      accept: () => {
        formUtilsStore.goToDetail(id);
      },
      reject: () => {
        formUtilsStore.closeForm();
      },
    });
  };

  const confirmNewTask = ({ id, emit }) => {
    confirm.require({
      message: i18n.t("task.notification-created-message"),
      header: i18n.t("task.notification-created-header"),
      acceptLabel: i18n.t("task.notification-created-detail"),
      rejectLabel: i18n.t("task.notification-created-close"),
      accept: () => {
        formUtilsStore.goToDetail(id, "task");
      },
      reject: () => {
        if (emit) {
          emit("closeSidebar");
        }
      },
    });
  };

  const confirmNewService = ({ id, emit }) => {
    confirm.require({
      message: i18n.t("service.notification-created-message"),
      header: i18n.t("service.notification-created-header"),
      acceptLabel: i18n.t("service.notification-created-detail"),
      rejectLabel: i18n.t("service.notification-created-close"),
      accept: () => {
        formUtilsStore.goToDetail(id);
      },
      reject: () => {
        if (emit) {
          emit("closeSidebar");
        }
      },
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
      message: i18n.t("project.notification-created-message"),
      header: i18n.t("project.notification-created-header"),
      acceptLabel: i18n.t("project.notification-created-detail"),
      rejectLabel: i18n.t("project.notification-created-close"),
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

  // { emit } = {} makes the parameters optional
  const confirmCancelDialog = ({ emit } = {}) => {
    return new Promise((resolve) => {
      confirm.require({
        message: `You haven't finished creating the new ${currentEntity.value}. Do you want to leave without saving it?`,
        header: `${currentEntity.value} not saved`,
        acceptLabel: "Stay on page",
        rejectLabel: "Leave without saving",
        accept: () => {
          resolve(true);
        },
        reject: async () => {
          if (emit) {
            emit("closeSidebar");
          }

          resolve(false);
        },
      });
    });
  };

  return {
    confirmNewCustomer,
    confirmNewContact,
    confirmNewTask,
    confirmNewService,
    confirmNewProject,
    cancelService,
    completeService,
    confirmCancelDialog,
  };
}

export default useDialog;
