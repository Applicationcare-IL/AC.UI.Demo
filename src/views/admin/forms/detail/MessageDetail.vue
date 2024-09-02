<template>
  <WMDetailFormSubHeader
    entity="message"
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
  <WMDetailMessageForm
    v-if="message"
    ref="detailMessageForm"
    :form-key="formKey"
    :message="message"
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

const { getMessage, activateMessage, deactivateMessage } = useAdminMessages();

// INJECT

// PROPS, EMITS

// REFS
const formKey = ref("adminMessageDetailForm");
const detailMessageForm = ref();
const message = ref(null);
const isActive = ref();
const isNotActive = ref();

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Message Detail",
});

const loadLazyData = async () => {
  message.value = await getMessage(route.params.id);
  utilsStore.selectedElements["message"] = [message.value];
  if (message.value.state.value === "active") isNotActive.value = true;
  if (message.value.state.value === "not_active") isActive.value = true;
};

const saveForm = () => {
  detailMessageForm.value.onSave();
};

const activateMessageFunc = () => {
  activateMessage({ ids: [message.value.id] })
    .then(() => {
      isActive.value = !isActive.value;
      isNotActive.value = !isNotActive.value;
      loadLazyData();
    })
    .catch((error) => {
      console.error(error);
    });
};

const deactivateMessageFunc = () => {
  deactivateMessage({ ids: [message.value.id] })
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

  utilsStore.entity = "message";
});
</script>

<style scoped></style>
