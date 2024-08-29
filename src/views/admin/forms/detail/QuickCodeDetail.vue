<template>
  <WMDetailFormSubHeader
      entity="quickCode"
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
          @click="activateQuickCodeFunc()"
      />
      <WMButton
          v-if="isNotActive"
          :text="$t('buttons.deactivate')"
          type="secondary"
          @click="deactivateQuickCodeFunc()"
      />
    </template>
  </WMDetailFormSubHeader>
  <WMDetailQuickCodeForm
      v-if="quickCode"
      ref="detailQuickCodeForm"
      :form-key="formKey"
      :quick-code="quickCode"
  />
</template>

<script setup>
// IMPORTS
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";

import useAdminQuickCodes from "@/composables/useAdminQuickCodes";
import {useUtilsStore} from "@/stores/utils";

// DEPENDENCIES
const route = useRoute();
const utilsStore = useUtilsStore();

const {getQuickCode, activateQuickCodes, deactivateQuickCode} = useAdminQuickCodes();

// INJECT

// PROPS, EMITS

// REFS

const formKey = ref("adminQuickCodeDetailForm");
const detailQuickCodeForm = ref();
const quickCode = ref(null);
const isActive = ref();
const isNotActive = ref();

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Quick Code Detail",
});

const loadLazyData = async () => {
  quickCode.value = await getQuickCode(route.params.id);
  utilsStore.selectedElements["quickCode"] = [quickCode.value];
  if (quickCode.value.state_id.value === "active") isNotActive.value = true;
  if (quickCode.value.state_id.value === "not_active") isActive.value = true;
}

const saveForm = () => {
  detailQuickCodeForm.value.onSave();
};

const activateQuickCodeFunc = () => {
  activateQuickCodes([quickCode.value.id])
      .then(() => {
        isActive.value = !isActive.value;
        isNotActive.value = !isNotActive.value;
        loadLazyData();
      })
      .catch((error) => {
        console.error(error);
      });
};

const deactivateQuickCodeFunc = () => {
  deactivateQuickCode(quickCode.value.id)
      .then(() => {
        isActive.value = !isActive.value;
        isNotActive.value = !isNotActive.value;
        loadLazyData();
      })
      .catch((error) => {
        console.error(error);
      });
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  loadLazyData();

  utilsStore.entity = "quickCode";
});
</script>

<style scoped></style>
