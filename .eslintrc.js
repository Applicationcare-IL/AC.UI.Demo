module.exports = {
  env: {
    node: true,
  },
  plugins: ["simple-import-sort"],
  extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "prettier"],
  rules: {
    "vue/component-api-style": [
      "error",
      ["script-setup", "composition"], // "script-setup", "composition", "composition-vue2", or "options"
    ],
    "vue/multi-word-component-names": [
      "error",
      {
        ignores: ["Services", "Tasks", "Customers", "Projects", "Contacts"],
      },
    ],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    // disabled rules from base configurations
    "vue/require-default-prop": "off",
    "vue/no-v-html": "off",
  },
  globals: {
    // Composables
    useAnnouncements: true,
    useCommunications: true,
    useContacts: true,
    useCustomers: true,
    useDialog: true,
    useDocuments: true,
    useFilters: true,
    useJournal: true,
    useLanguages: true,
    useLicensing: true,
    useListUtils: true,
    useProjects: true,
    useSearch: true,
    useServices: true,
    useSidebar: true,
    useTasks: true,
    useToast: true,
    useUtils: true,
    useHead: true,
    useNavigationGuards: true,
  },
};
