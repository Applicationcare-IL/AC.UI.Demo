<template>
  <Card>
    <template #title> Execution information </template>
    <template #content> City / Address </template>
  </Card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useOptionSetsStore } from "@/stores/optionSets";
</script>

<style scoped lang="scss"></style>
