<template>
  <WMNewFormSubHeader @save-form="saveForm()" @cancel-form="cancelForm()" />
  <WMNewTeamForm ref="newAdminTeamForm"/>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const newAdminTeamForm = ref();

const saveForm = () => {
  newAdminTeamForm.value.onSubmit();
};

const cancelForm = () => {
  router.push({ name: "adminTeams" });
};
</script>