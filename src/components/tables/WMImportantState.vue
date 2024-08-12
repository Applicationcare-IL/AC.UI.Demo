<template>
  <div>
    <Chip v-if="important === 0" :label="$t('message.normal')"  />
    <Chip v-if="important === 1" :label="'!'+$t('message.important')" class="bg-orange-500 text-white" />
  </div>
</template>

<script setup>
// IMPORTS

// DEPENDENCIES

// INJECT

// PROPS, EMITS
const props = defineProps({
  important: String,
});

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
