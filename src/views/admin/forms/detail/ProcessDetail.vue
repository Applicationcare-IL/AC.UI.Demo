<template>
  <WMDetailFormSubHeader
    entity="process"
    :form-key="formKey"
    :has-action-builder="false"
    :show-message-button="false"
    :show-email-button="false"
    @save-form="saveForm()"
  >
    <template #top-left>
      <WMButton
        v-if="isActive"
        :text="$t('buttons.activate')"
        type="secondary"
        @click="activateProcessFunc()"
      />
      <WMButton
        v-if="isNotActive"
        :text="$t('buttons.deactivate')"
        type="secondary"
        @click="deactivateProcessFunc()"
      />
    </template>
  </WMDetailFormSubHeader>
  <WMDetailProcessForm
    v-if="process"
    ref="detailProcessForm"
    :form-key="formKey"
    :process="process"
  />
</template>

<script setup>
// IMPORTS
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const route = useRoute();
const utilsStore = useUtilsStore();
const { getProcess } = useAdminProcess();

// INJECT

// PROPS, EMITS

// REFS
const formKey = ref("adminProcessDetailForm");
const detailProcessForm = ref();
const process = ref(null);
// const isActive = ref();
// const isNotActive = ref();

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Process Detail",
});

const loadLazyData = async () => {
  process.value = await getProcess(route.params.id);
  utilsStore.selectedElements["process"] = [process.value];
  //   if (process.value.state.value === "active") isNotActive.value = true;
  //   if (process.value.state.value === "not_active") isActive.value = true;
};

const saveForm = () => {
  detailProcessForm.value.onSave();
};

// const activateProcessFunc = () => {
//   activateProcess({ ids: [process.value.id] })
//     .then(() => {
//       isActive.value = !isActive.value;
//       isNotActive.value = !isNotActive.value;
//       loadLazyData();
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// };

// const deactivateProcessFunc = () => {
//   deactivateProcess({ ids: [process.value.id] })
//     .then(() => {
//       isActive.value = !isActive.value;
//       isNotActive.value = !isNotActive.value;
//       loadLazyData();
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// };

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  await loadLazyData();

  utilsStore.entity = "process";
});
</script>

<style scoped></style>
