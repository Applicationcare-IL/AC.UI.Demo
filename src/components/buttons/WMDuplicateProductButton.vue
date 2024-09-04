<template>
  <WMButton :text="$t('buttons.duplicate')" type="type-5" @click="duplicateProduct">
    <template #customIcon>
      <div class="flex" v-html="DuplicateIcon" />
    </template>
  </WMButton>
</template>

<script setup>
// IMPORTS
import DuplicateIcon from "/icons/duplicate.svg?raw";

// DEPENDENCIES

// INJECT

// PROPS, EMITS

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
