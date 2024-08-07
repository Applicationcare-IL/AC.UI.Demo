<template>
  <WMDetailFormSubHeader
    entity="employee"
    :form-key="formKey"
    :has-action-builder="false"
    :show-message-button="false"
    :show-email-button="false"
    @save-form="saveForm()"
  >
    <template #top-left>
      <WMButton :text="$t('buttons.activate')" type="secondary" />
      <WMButton :text="$t('buttons.deactivate')" type="secondary" />
    </template>
    <template #custom-buttons>
      <div class="flex gap-3">
        <WMResetPassAdminUsersButton :selected-users="selectedUsers" />
      </div>
    </template>
  </WMDetailFormSubHeader>
  <WMDetailUserForm v-if="user" ref="detailUserForm" :form-key="formKey" :user="user" />
</template>

<script setup>
// IMPORTS
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const route = useRoute();
const { getUser } = useAdminUsers();
const utilsStore = useUtilsStore();

// INJECT

// PROPS, EMITS

// REFS
const formKey = ref("adminUserDetailForm");
const detailUserForm = ref();
const user = ref(null);

// COMPUTED
const selectedUsers = computed(() => {
  return [{ id: route.params.id }];
});

// COMPONENT METHODS AND LOGIC
useHead({
  title: "User Detail",
});

const loadLazyData = async () => {
  user.value = await getUser(route.params.id);
  utilsStore.selectedElements["employee"] = [user.value];
};

utilsStore.entity = "employee";

loadLazyData();

const saveForm = () => {
  detailUserForm.value.onSave();
};

// const activateUser

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
