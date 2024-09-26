<template>
  <WMDetailFormSubHeader
    entity="service"
    :form-key="formKey"
    @save-form="saveForm()"
    @refresh-table="refreshTable"
  >
    <template #bottom-left>
      <WMMessagesButton :id="route.params.id" entity="service" />
    </template>
  </WMDetailFormSubHeader>
  <WMDetailServiceForm ref="detailServiceForm" :form-key="formKey" />
</template>

<script setup>
// IMPORTS
import { ref } from "vue";
import { useRoute } from "vue-router";

// DEPENDENCIES
const route = useRoute();

// INJECT

// PROPS, EMITS

// REFS
const formKey = ref("serviceDetailForm");

const detailServiceForm = ref(null);

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Service Detail",
});

const saveForm = () => {
  detailServiceForm.value.onSave();
};

const refreshTable = () => {
  detailServiceForm.value.fetchData();
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
