<template>
  <WMActionBuilderDropdown
    v-for="scope in scopes"
    :key="scope.id"
    :label="scope.label"
    :actions="scope.actions"
    :selected-elements="selectedElements"
    :entity="entity"
    @post-action-executed="$emit('postActionExecuted')"
  />
</template>

<script setup>
defineProps({
  scopes: Array,
  selectedElements: {
    type: Number,
    default: 0,
  },
  entity: String,
});

defineEmits(["postActionExecuted"]);
</script>

<style scoped></style>
