<template>
  <WMInput
    name="owner"
    type="info"
    :highlighted="true"
    :label="$t('owner') + ':'"
    :value="authStore.userFullName"
    size="sm"
  />
  <WMInput
    v-if="authStore.team"
    name="id"
    type="info"
    :highlighted="true"
    :label="$t('team.team') + ':'"
    :value="authStore.team"
    size="sm"
  />
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
</script>
