<template>
  <WMProjectTeamTable :customerId="route.params.id" />
</template>
<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<style scoped lang="scss"></style>
