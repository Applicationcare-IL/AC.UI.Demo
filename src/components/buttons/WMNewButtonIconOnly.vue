<template>
  <WMButton type="new" :icon-only="true" @click="toggle">
    <template #customIcon>
      <div class="flex" v-html="PlusIcon" />
    </template>
  </WMButton>
</template>

<script setup>
import PlusIcon from "/icons/plus.svg?raw";
</script>
