<template>
  <!-- Type text -->
  <template v-if="type == 'text'">
    {{ value }}
  </template>
  <!-- Type project-link -->
  <template v-if="type == 'project-link'">
    <router-link
      v-if="value"
      :to="{
        name: 'projectDetail',
        params: { id: value.id },
      }"
    >
      {{ value.name }}
    </router-link>
  </template>
</template>
<script setup>
defineProps({
  type: String,
  value: String,
});
</script>
