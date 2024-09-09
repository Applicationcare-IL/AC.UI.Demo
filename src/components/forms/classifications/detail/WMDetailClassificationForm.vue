<template>
  <span>Detail classification form</span>
  <!--  <pre>{{ classification }}</pre>-->
</template>

<script setup>
// IMPORTS
import {onMounted} from "vue";

import {useFormUtilsStore} from "@/stores/formUtils";

// DEPENDENCIES
const formUtilsStore = useFormUtilsStore();

// INJECT

// PROPS, EMITS
const props = defineProps({
  classification: {
    type: Object,
    required: true,
  },
  formKey: {
    type: String,
    required: true,
  },
});

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  formUtilsStore.formEntity = "classification";

})
</script>

<style scoped></style>
