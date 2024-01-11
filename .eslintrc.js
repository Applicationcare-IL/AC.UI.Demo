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
    // composables
    useTasks: true,
  },
};
