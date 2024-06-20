<template>
  <div class="m-5">
    <pre>{{ script }}</pre>
  </div>
</template>

<script setup>
// IMPORTS
import { ref } from "vue";
import { useRoute } from "vue-router";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { getScript } = useAdminFlowmaze();
const route = useRoute();
const formUtilsStore = useFormUtilsStore();
const utilsStore = useUtilsStore();

// INJECT

// PROPS, EMITS

// REFS
const script = ref(null);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const fetchScript = () => {
  getScript(route.params.id).then((result) => {
    script.value = result;
    utilsStore.selectedElements["script"] = [script.value];
  });
};

fetchScript();

formUtilsStore.formEntity = "script";
utilsStore.entity = "script";

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
