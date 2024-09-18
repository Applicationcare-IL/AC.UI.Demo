<template>
  <WMDetailFormSubHeader
    entity="role"
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
        @click="activateRoleFunc()"
      />
      <WMButton
        v-if="isNotActive"
        :text="$t('buttons.deactivate')"
        type="secondary"
        @click="deactivateRoleFunc()"
      />
    </template>
  </WMDetailFormSubHeader>
  <WMDetailRoleForm v-if="role" ref="detailRoleForm" :role="role" :form-key="formKey" />
</template>

<script setup>
// IMPORTS
import { ref } from "vue";
import { useRoute } from "vue-router";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { getRole, activateRoles, deactivateRole } = useAdminRoles();
const route = useRoute();
const utilsStore = useUtilsStore();

// INJECT

// PROPS, EMITS

// REFS
const detailRoleForm = ref();
const formKey = ref("adminRoleDetailForm");
const role = ref(null);
const isActive = ref();
const isNotActive = ref();

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Role Detail",
});

const loadLazyData = async () => {
  role.value = await getRole(route.params.id);
  utilsStore.selectedElements["role"] = [role.value];
  if (role.value.state.value === "active") isNotActive.value = true;
  if (role.value.state.value === "not_active") isActive.value = true;
};

utilsStore.entity = "role";

loadLazyData();

const saveForm = () => {
  detailRoleForm.value.onSave();
};

const activateRoleFunc = () => {
  activateRoles([role.value.id])
    .then(() => {
      isActive.value = !isActive.value;
      isNotActive.value = !isNotActive.value;
      loadLazyData();
    })
    .catch((error) => {
      console.error(error);
    });
};

const deactivateRoleFunc = () => {
  deactivateRole(role.value.id)
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
</script>

<style scoped></style>
