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
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
  },
  globals: {
    // Composables
    useAnnouncements: true,
    useCommunications: true,
    useContacts: true,
    useCustomers: true,
    useDialogs: true,
    useDocuments: true,
    useFilters: true,
    useJournal: true,
    useLangauges: true,
    useLicensing: true,
    useListUtils: true,
    useProjects: true,
    useSearch: true,
    useServices: true,
    useSidebar: true,
    useTasks: true,
    useToast: true,
    useUtils: true,
  },
};
