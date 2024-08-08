<template>
  <WMDetailFormSubHeader
    entity="message"
    :form-key="formKey"
    :has-action-builder="false"
    :show-message-button="false"
    :show-email-button="false"
    @save-form="saveForm()"
  >
  </WMDetailFormSubHeader>
  <WMDetailMessageForm v-if="message" ref="detailMessageForm" :form-key="formKey" :message="message" />
</template>

<script setup>
// IMPORTS
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useUtilsStore } from "@/stores/utils";

import useAdminMessages from "@/composables/useAdminMessages";

// DEPENDENCIES
const route = useRoute();
const utilsStore = useUtilsStore();

const { getMessage } = useAdminMessages();

// INJECT

// PROPS, EMITS

// REFS
const formKey = ref("adminMessageDetailForm");
const detailMessageForm = ref();
const message = ref(null);

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Message Detail",
});

const loadLazyData = async () => {
  message.value = await getMessage(route.params.id);
  utilsStore.selectedElements["message"] = [message.value];
};

loadLazyData();

utilsStore.entity = "message";

const saveForm = () => {
  detailMessageForm.value.onSave();
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
