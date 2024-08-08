<template>
  <WMButton :text="text" type="remove">
    <template #customIcon>
      <div class="flex" v-html="DeleteIcon" />
    </template>
  </WMButton>
</template>

<script setup>
import DeleteIcon from "/icons/delete.svg?raw";

defineProps({
  text: String,
});
</script>
