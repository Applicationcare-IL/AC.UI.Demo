<template>
  <WMNewFormSubHeader @save-form="saveForm()" @cancel-form="cancelForm()" />
  <template v-if="can('roles.create')">
    <WMNewRoleForm ref="newAdminRoleForm" />
  </template>
  <template v-else>
    <div class="m-5">
      {{ $t("permissions.you-dont-have-permission") }}
    </div>
  </template>
</template>

<script setup>
// IMPORTS
import { ref } from "vue";
import { useRouter } from "vue-router";

// DEPENDENCIES
const router = useRouter();
const { can } = usePermissions();


// INJECT

// PROPS, EMITS

// REFS
const newAdminRoleForm = ref();

// COMPUTED

// COMPONENT METHODS AND LOGIC
const saveForm = () => {
  newAdminRoleForm.value.onSubmit();
};

const cancelForm = () => {
  router.push({ name: "adminRoles" });
};
</script>