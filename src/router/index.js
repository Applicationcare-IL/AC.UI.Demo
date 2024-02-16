// import { storeToRefs } from "pinia";
// import { useConfirm } from "primevue/useconfirm";
import { createRouter, createWebHistory } from "vue-router";

import { ENTITIES } from "@/constants";
import AppLayout from "@/layout/AppLayout.vue";
import { useAuthStore } from "@/stores/auth";

function getEmail(string) {
  const regex = /email=([^&]+)/;

  const match = string.match(regex);

  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  }

  return null;
}

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
          // exact: true,
          redirect: () => {
            return "/tasks";
          },
          // component: () => import("@/views/user/Dashboard.vue"),
        },
        {
          path: "/buttons",
          name: "buttons",
          exact: true,
          component: () => import("@/views/Buttons.vue"),
        },
        {
          path: "/search/:query",
          name: "search",
          component: () => import("@/views/user/Search.vue"),
        },
        {
          path: "/dashboard",
          name: "dashboard",
          // redirect: () => {
          //   return "/tasks";
          // },
          component: () => import("@/views/user/Dashboard.vue"),
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
          component: () =>
            import("@/views/user/forms/detail/ProjectBudget.vue"),
        },
        {
          path: "/project/:id/budget-item/:budgetId",
          name: "projectBudgetItemDetail",
          component: () =>
            import("@/views/user/forms/detail/ProjectBudgetItem.vue"),
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
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const { can } = usePermissions();

  if (ENTITIES.includes(to.name)) {
    if (!can(`${to.name}.read`)) {
      console.log("no puedo entrar a tasks");
      next("/dashboard");
    }
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

// router.beforeResolve(async () => {
//   const formUtilsStore = useFormUtilsStore();
//   const { confirmCancelDialog } = useDialog();
//   const { formMeta } = storeToRefs(formUtilsStore);

//   // check if there's some dirty forms and show confirm dialog
//   console.log("formMeta", formMeta.value.dirty);
//   if (formMeta.value.dirty) {
//     confirmCancelDialog();
//   }
// });

export default router;
