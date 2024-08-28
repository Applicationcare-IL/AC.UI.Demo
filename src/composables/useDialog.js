import { useConfirm } from "primevue/useconfirm";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import { useFormUtilsStore } from "@/stores/formUtils";

const useDialog = () => {
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

  const confirmNewAdminUser = ({ id, emit }) => {
    confirm.require({
      message: i18n.t("employee.notification-created-message"),
      header: i18n.t("employee.notification-created-header"),
      acceptLabel: i18n.t("employee.notification-created-detail"),
      rejectLabel: i18n.t("employee.notification-created-close"),
      accept: () => {
        formUtilsStore.goToAdminDetail(id, "user");
      },
      reject: () => {
        if (emit) {
          emit("closeSidebar");
        }
      },
    });
  };

  const confirmNewAdminTeam = ({ id, emit }) => {
    confirm.require({
      message: i18n.t("team.notification-created-message"),
      header: i18n.t("team.notification-created-header"),
      acceptLabel: i18n.t("team.notification-created-detail"),
      rejectLabel: i18n.t("team.notification-created-close"),
      accept: () => {
        formUtilsStore.goToAdminDetail(id, "team");
      },
      reject: () => {
        if (emit) {
          emit("closeSidebar");
        }
      },
    });
  };

  const confirmNewAdminRole = ({ id, emit }) => {
    confirm.require({
      message: i18n.t("team.notification-created-message"),
      header: i18n.t("team.notification-created-header"),
      acceptLabel: i18n.t("team.notification-created-detail"),
      rejectLabel: i18n.t("team.notification-created-close"),
      accept: () => {
        formUtilsStore.goToAdminDetail(id, "role");
      },
      reject: () => {
        if (emit) {
          emit("closeSidebar");
        }
      },
    });
  };

  const confirmNewAdminMessage = ({id, emit}) => {
    confirm.require({
      message: i18n.t("message.notification-created-message"),
      header: i18n.t("message.notification-created-header"),
      acceptLabel: i18n.t("message.notification-created-detail"),
      rejectLabel: i18n.t("message.notification-created-close"),
      accept: () => {
        formUtilsStore.goToAdminDetail(id, "message");
      },
      reject: () => {
        if (emit) {
          emit("closeSidebar");
        }
      },
    });
  };

  const confirmNewAdminReport = ({ id, emit }) => {
    confirm.require({
      message: i18n.t("admin-report.notification-created-message"),
      header: i18n.t("admin-report.notification-created-header"),
      acceptLabel: i18n.t("admin-report.notification-created-detail"),
      rejectLabel: i18n.t("admin-report.notification-created-close"),
      accept: () => {
        formUtilsStore.goToAdminDetail(id, "report");
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

  const confirmCancelTask = () => {
    return new Promise((resolve) => {
      confirm.require({
        message: i18n.t("task.notification-cancel-task-message"),
        header: i18n.t("task.notification-cancel-task-header"),
        acceptLabel: i18n.t("task.notification-cancel-task-yes"),
        rejectLabel: i18n.t("task.notification-cancel-task-no"),
        accept: () => {
          resolve(true);
        },
        reject: () => {
          resolve(false);
        },
      });
    });
  };

  const confirmCancelProject = () => {
    return new Promise((resolve) => {
      confirm.require({
        message: i18n.t("project.notification-cancel-project-message"),
        header: i18n.t("project.notification-cancel-project-header"),
        acceptLabel: i18n.t("project.notification-cancel-project-yes"),
        rejectLabel: i18n.t("project.notification-cancel-project-no"),
        accept: () => {
          resolve(true);
        },
        reject: () => {
          resolve(false);
        },
      });
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

  const confirmCompleteTasks = () => {
    return new Promise((resolve) => {
      confirm.require({
        group: "completeService",
        message: i18n.t("service.notification-complete-service-message"),
        header: i18n.t("service.notification-complete-service-header"),
        acceptLabel: i18n.t("buttons.continue"),
        rejectLabel: i18n.t("buttons.cancel"),
        accept: () => {
          resolve(true);
        },
        reject: () => {
          resolve(false);
        },
      });
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

  const confirmCompleteMilestone = () => {
    return new Promise((resolve) => {
      confirm.require({
        message: i18n.t("milestone.notification-complete-milestone-message"),
        header: i18n.t("milestone.notification-complete-milestone-header"),
        acceptLabel: i18n.t("milestone.complete-milestone"),
        rejectLabel: i18n.t("milestone.return"),
        accept: () => {
          resolve(true);
        },
        reject: () => {
          resolve(false);
        },
      });
    });
  };

  const confirmUnlinkRelatedService = () => {
    return new Promise((resolve) => {
      confirm.require({
        message: i18n.t("service.unlink-related-service-dialog-message"),
        header: i18n.t("service.unlink-related-service-dialog-header"),
        acceptLabel: i18n.t("service.unlink-service"),
        rejectLabel: i18n.t("buttons.cancel"),
        accept: () => {
          resolve(true);
        },
        reject: () => {
          resolve(false);
        },
      });
    });
  };

  return {
    confirmNewCustomer,
    confirmNewContact,
    confirmNewTask,
    confirmNewAdminUser,
    confirmNewAdminTeam,
    confirmNewAdminRole,
    confirmNewAdminMessage,
    confirmNewService,
    confirmNewProject,
    confirmNewAdminReport,
    cancelService,
    confirmCompleteTasks,
    confirmCancelTask,
    confirmCancelProject,
    confirmCancelDialog,
    confirmCompleteMilestone,
    confirmUnlinkRelatedService,
  };
};

export default useDialog;
