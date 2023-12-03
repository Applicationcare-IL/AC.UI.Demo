<template>
  <!-- <WMContactsTable :columns="contactColumns" :customerId="route.params.id" /> -->
</template>
<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const { getContactColumns } = useListUtils();

const contactColumns = ref(getContactColumns());
</script>

<style scoped lang="scss"></style>
