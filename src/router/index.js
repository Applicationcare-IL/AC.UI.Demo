// import { storeToRefs } from "pinia";
// import { useConfirm } from "primevue/useconfirm";
import { createRouter, createWebHistory } from "vue-router";

import { ENTITIES } from "@/constants";
import AppLayout from "@/layout/AppLayout.vue";
import { useAuthStore } from "@/stores/auth";

const getEmail = (string) => {
  const regex = /email=([^&]+)/;

  const match = string.match(regex);

  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  }

  return null;
};

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/auth/Login.vue"),
    },
    {
      path: "/forgot-password",
      name: "forgotPassword",
      component: () => import("@/views/auth/ForgotPassword.vue"),
    },
    {
      path: "/reset-password",
      name: "resetPassword",
      component: () => import("@/views/auth/ResetPassword.vue"),
      props: (route) => {
        return {
          token: route.query.token,
          email: getEmail(route.href),
        };
      },
    },

    {
      path: "/",
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: "/",
          name: "index",
          redirect: () => {
            return "/dashboard";
          },
        },
        {
          path: "/search/:query",
          name: "search",
          component: () => import("@/views/user/Search.vue"),
        },
        {
          // Note that nested paths that start with / will be treated as root paths.
          // This allows you to leverage the component nesting without having to use a nested URL.
          path: "/dashboard",
          name: "dashboard",
          component: () => import("@/views/dashboard/Dashboard.vue"),
        },
        {
          path: "/contacts",
          name: "contacts",
          meta: {
            permissions: "contacts.read",
          },
          component: () => import("@/views/user/lists/Contacts.vue"),
        },
        {
          path: "/new-contact",
          name: "newContact",
          component: () => import("@/views/user/forms/new/Contact.vue"),
        },
        {
          path: "/contact/:id",
          name: "contactDetail",
          component: () => import("@/views/user/forms/detail/Contact.vue"),
        },
        {
          path: "/customers",
          name: "customers",
          component: () => import("@/views/user/lists/Customers.vue"),
        },
        {
          path: "/new-customer",
          name: "newCustomer",
          component: () => import("@/views/user/forms/new/Customer.vue"),
        },
        {
          path: "/customer/:id",
          name: "customerDetail",
          component: () => import("@/views/user/forms/detail/Customer.vue"),
        },
        {
          path: "/services",
          name: "services",
          component: () => import("@/views/user/lists/Services.vue"),
        },
        {
          path: "/new-service",
          name: "newService",
          component: () => import("@/views/user/forms/new/Service.vue"),
        },
        {
          path: "/service/:id",
          name: "serviceDetail",
          component: () => import("@/views/user/forms/detail/Service.vue"),
        },
        {
          path: "/tasks",
          name: "tasks",
          component: () => import("@/views/user/lists/Tasks.vue"),
        },
        {
          path: "/new-task",
          name: "newTask",
          component: () => import("@/views/user/forms/new/Task.vue"),
        },
        {
          path: "/task/:id",
          name: "taskDetail",
          component: () => import("@/views/user/forms/detail/Task.vue"),
        },
        {
          path: "/projects",
          name: "projects",
          component: () => import("@/views/user/lists/Projects.vue"),
        },
        {
          path: "/new-project",
          name: "newProject",
          component: () => import("@/views/user/forms/new/Project.vue"),
        },
        {
          path: "/project/:id",
          name: "projectDetail",
          component: () => import("@/views/user/forms/detail/Project.vue"),
        },
        {
          path: "/project/:id/budget",
          name: "projectBudget",
          component: () => import("@/views/user/forms/detail/ProjectBudget.vue"),
        },
        {
          path: "/project/:id/milestone/:milestoneId",
          name: "projectMilestoneDetail",
          component: () => import("@/views/user/forms/detail/ProjectMilestone.vue"),
        },
        {
          path: "/project/:id/budget-item/:budgetItemId",
          name: "projectBudgetItemDetail",
          component: () => import("@/views/user/forms/detail/ProjectBudgetItem.vue"),
        },
        //The path assets is reserved, so we can't use it
        {
          path: "/assets_list",
          name: "assets",
          component: () => import("@/views/user/lists/Assets.vue"),
        },
        {
          path: "/asset/:id",
          name: "assetDetail",
          component: () => import("@/views/user/forms/detail/Asset.vue"),
        },
        // FOR MOBILE VERSION ONLY
        {
          path: "/my-open-tasks",
          name: "myOpenTasksMobile",
          component: () => import("@/views/mobile/MyOpenTasks.vue"),
        },
        {
          path: "/my-closed-tasks",
          name: "myClosedTasksMobile",
          component: () => import("@/views/mobile/MyClosedTasks.vue"),
        },
        {
          path: "/task-detail/:id",
          name: "taskDetailMobile",
          component: () => import("@/views/mobile/MobileTaskDetail.vue"),
        },
        {
          path: "/create-new-service",
          name: "newServiceMobile",
          component: () => import("@/views/mobile/MobileNewService.vue"),
        },
        {
          path: "/reports",
          name: "reports",
          component: () => import("@/views/user/lists/Reports.vue"),
        },
        {
          path: "/products",
          name: "products",
          component: () => import("@/views/user/lists/Products.vue"),
        },
      ],
    },
    {
      path: "/admin",
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: "/admin",
          name: "adminIndex",
          redirect: () => {
            return "/admin/users";
          },
        },
        {
          path: "users",
          name: "adminUsers",
          component: () => import("@/views/admin/lists/UsersListPage.vue"),
        },
        {
          path: "users/new-user",
          name: "newUser",
          component: () => import("@/views/admin/forms/new/NewUser.vue"),
        },
        {
          path: "user/:id",
          name: "adminUserDetail",
          component: () => import("@/views/admin/forms/detail/UserDetail.vue"),
        },
        {
          path: "teams",
          name: "adminTeams",
          component: () => import("@/views/admin/lists/TeamsListPage.vue"),
        },
        {
          path: "teams/new-team",
          name: "newTeam",
          component: () => import("@/views/admin/forms/new/NewTeam.vue"),
        },
        {
          path: "team/:id",
          name: "adminTeamDetail",
          component: () => import("@/views/admin/forms/detail/TeamDetail.vue"),
        },
        {
          path: "roles",
          name: "adminRoles",
          component: () => import("@/views/admin/lists/RolesListPage.vue"),
        },
        {
          path: "roles/new-role",
          name: "newRole",
          component: () => import("@/views/admin/forms/new/NewRole.vue"),
        },
        {
          path: "permissions",
          name: "adminPermissions",
          component: () => import("@/views/admin/lists/PermissionsListPage.vue"),
        },
        {
          path: "processes",
          name: "adminProcesses",
          component: () => import("@/views/admin/lists/ProcessesListPage.vue"),
        },
        {
          path: "classifications",
          name: "adminClassifications",
          component: () => import("@/views/admin/lists/ClassificationsListPage.vue"),
        },
        {
          path: "sla-settings",
          name: "adminSlaSettings",
          component: () => import("@/views/admin/lists/SLASettingsListPage.vue"),
        },
        {
          path: "task-settings",
          name: "adminTaskSettings",
          component: () => import("@/views/admin/lists/TaskSettingsListPage.vue"),
        },
        {
          path: "quick-codes",
          name: "adminQuickCodes",
          component: () => import("@/views/admin/lists/QuickCodesListPage.vue"),
        },
        {
          path: "quick-codes/new-quick-codes",
          name: "newQuickCode",
          component: () => import("@/views/admin/forms/new/NewQuickCode.vue"),
        },
        {
          path: "messages",
          name: "adminMessages",
          component: () => import("@/views/admin/lists/MessagesListPage.vue"),
        },
        {
          path: "messages/new-messages",
          name: "newMessage",
          component: () => import("@/views/admin/forms/new/NewMessage.vue"),
        },
        {
          path: "option-sets",
          name: "adminOptionSets",
          component: () => import("@/views/admin/lists/OptionSetsListPage.vue"),
        },
        {
          path: "triggers",
          name: "adminTriggers",
          component: () => import("@/views/admin/lists/TriggersListPage.vue"),
        },
        {
          path: "dynamic-attributes",
          name: "adminDynamicAttributes",
          component: () => import("@/views/admin/lists/DynamicAttributesListPage.vue"),
        },
        {
          path: "url-action-builder",
          name: "adminUrlActionBuilder",
          component: () => import("@/views/admin/lists/URLActionBuilderListPage.vue"),
        },
        {
          path: "import",
          name: "adminImport",
          component: () => import("@/views/admin/lists/ImportListPage.vue"),
        },
        {
          path: "translations",
          name: "adminTranslations",
          component: () => import("@/views/admin/lists/TranslationsListPage.vue"),
        },
        {
          path: "system-settings",
          name: "adminSystemSettings",
          component: () => import("@/views/admin/lists/SystemSettingsListPage.vue"),
        },
        {
          path: "scripts",
          name: "adminScripts",
          component: () => import("@/views/admin/lists/ScriptsListPage.vue"),
        },
        {
          path: "scripts/:id",
          name: "scriptDetail",
          component: () => import("@/views/admin/forms/detail/ScriptDetail.vue"),
        },
        {
          path: "reports",
          name: "adminReports",
          component: () => import("@/views/admin/lists/ReportsListPage.vue"),
        },
        {
          path: "reports/new-report",
          name: "newAdminReport",
          component: () => import("@/views/admin/forms/new/NewReport.vue"),
        },
        {
          path: "reports/:id",
          name: "adminReportDetail",
          component: () => import("@/views/admin/forms/detail/ReportDetail.vue"),
        },
        {
          path: "reports-poc",
          name: "reportsPoc",
          component: () => import("@/views/user/lists/ReportsPOC.vue"),
        },
        {
          path: "schema",
          name: "schema",
          component: () => import("@/views/user/lists/Schema.vue"),
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const { can, isPermissionsLoaded, fetchPermissionsFromApi } = usePermissions();

  if (!isPermissionsLoaded.value) {
    await fetchPermissionsFromApi();
  }

  if (ENTITIES.includes(to.name)) {
    if (!can(`${to.name}.read`)) {
      next("/dashboard");
    }
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router;
