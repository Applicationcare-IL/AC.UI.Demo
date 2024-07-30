<template>
  <WMDetailFormSubHeader
    entity="employee"
    :form-key="formKey"
    :has-action-builder="false"
    :show-message-button="false"
    :show-email-button="false"
    @save-form="saveForm()"
  >
    <template #custom-buttons>
      <div class="flex gap-3">
        <WMResetPassAdminUsersButton
            :selected-users="selectedUsers"
        />
      </div>
    </template>
  </WMDetailFormSubHeader>
  <WMDetailUserForm ref="detailUserForm" :form-key="formKey" />
</template>

<script setup>
// IMPORTS
import { computed,ref } from "vue";
import {useRoute} from "vue-router";

// DEPENDENCIES
const route = useRoute();

// INJECT

// PROPS, EMITS

// REFS
const formKey = ref("adminUserDetailForm");
const detailUserForm = ref();

// COMPUTED
const selectedUsers = computed(() => {
  return [{id: route.params.id}];
});

// COMPONENT METHODS AND LOGIC
useHead({
  title: "User Detail",
});

const saveForm = () => {
  detailUserForm.value.onSave();
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
