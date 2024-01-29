<template>
  <WMInput
    name="owner"
    type="info"
    :highlighted="true"
    :label="$t('owner') + ':'"
    :value="authStore.userFullName"
  />
  <WMInput
    v-if="authStore.team"
    name="id"
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
