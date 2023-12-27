<template>
  <WMInput
    name="owner"
    type="info"
    :highlighted="true"
    :label="$t('owner') + ':'"
    :value="authStore.userFullName"
  />
  <WMInput
    name="id"
    v-if="authStore.team"
    type="info"
    :highlighted="true"
    :label="$t('team') + ':'"
    :value="authStore.team"
  />
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
</script>
