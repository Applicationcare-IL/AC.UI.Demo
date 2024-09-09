<template>
  <WMDetailFormSubHeader
      entity="classification"
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
          @click="activateMessageFunc()"
      />
      <WMButton
          v-if="isNotActive"
          :text="$t('buttons.deactivate')"
          type="secondary"
          @click="deactivateMessageFunc()"
      />
    </template>
  </WMDetailFormSubHeader>
  <WMDetailClassificationForm
      v-if="classification"
      ref="detailClassificationForm"
      :form-key="formKey"
      :classification="classification"
  />
</template>

<script setup>
// IMPORTS
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";

import {useUtilsStore} from "@/stores/utils";

// DEPENDENCIES
const route = useRoute();
const utilsStore = useUtilsStore();

const {getClassification} = useAdminClassifications();
// INJECT

// PROPS, EMITS

// REFS
const formKey = ref("adminClassificationDetailForm");
const detailClassificationForm = ref();
const classification = ref(null);

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Classification Detail",
});

const loadLazyData = async () => {
  classification.value = await getClassification(route.params.id);
  utilsStore.selectedElements["classification"] = [classification.value];
}

const saveForm = () => {
  detailClassificationForm.value.onSave();
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  loadLazyData();

  utilsStore.entity = "classification";
});
</script>

<style scoped></style>
