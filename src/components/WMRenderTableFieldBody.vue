<template>
  <!-- Type text -->
  <template v-if="columnData.type == 'text'">
    {{ modelValue }}
  </template>
  <!-- Type project-link -->
  <template v-if="columnData.type == 'link'">
    <router-link
      v-if="modelValue"
      :to="{
        name: columnData.routeName,
        params: { id: modelValue.id },
      }"
    >
      {{ modelValue.text }}
    </router-link>
  </template>
</template>
<script setup>
defineProps({
  columnData: Object,
});

const modelValue = defineModel();
</script>
