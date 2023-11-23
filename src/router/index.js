import { createRouter, createWebHashHistory } from "vue-router";
import AppLayout from "@/layout/AppLayout.vue";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/auth/Login.vue"),
    },
    {
      path: "/",
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: "/",
          name: "dashboard",
          exact: true,
          component: () => import("@/views/user/Dashboard.vue"),
        },
        {
          path: "/search/:query",
          name: "search",
          component: () => import("@/views/user/Search.vue"),
        },
        {
          path: "/dashboard",
          name: "dashboard",
          component: () => import("@/views/user/Dashboard.vue"),
        },
        {
          path: "/contacts",
          name: "contacts",
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
          path: "/projects/:id",
          name: "projectDetail",
          component: () => import("@/views/user/forms/detail/Project.vue"),
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router;
