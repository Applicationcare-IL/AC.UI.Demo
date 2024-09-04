<template>
  <WMButton :text="$t('buttons.new-version')" type="type-5" @click="duplicateProduct">
    <template #customIcon>
      <div class="flex" v-html="NewVersionIcon" />
    </template>
  </WMButton>
</template>

<script setup>
// IMPORTS
import NewVersionIcon from "/icons/versions.svg?raw";

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
