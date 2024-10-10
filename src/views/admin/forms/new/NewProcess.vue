<template>
  <WMNewFormSubHeader @save-form="saveForm()" @cancel-form="cancelForm()" />
  <template v-if="can('processes.create')">
    <WMNewProcessForm ref="newAdminProcessForm" />
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
const newAdminProcessForm = ref();

// COMPUTED

// COMPONENT METHODS AND LOGIC
const saveForm = () => {
  newAdminProcessForm.value.onSubmit();
};

const cancelForm = () => {
  router.push({ name: "adminProcesses" });
};
</script>
