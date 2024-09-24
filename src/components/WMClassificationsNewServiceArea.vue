<template>
  <template v-if="can('classifications.create')">
    <div class="m-3">
      <div class="flex flex-row justify-content-between align-content-center">
        <h1 class="h1 mb-0">New service area</h1>
      </div>
      <Divider />
    </div>
    <WMNewClassificationForm
      :is-sidebar="true"
      @new-classification-created="handleNewClassificationCreated"
    />
  </template>
  <template v-else>
    <div class="m-5">
      {{ $t("permissions.you-dont-have-permission") }}
    </div>
  </template>
</template>

<script setup>
// IMPORTS

// DEPENDENCIES
const { can } = usePermissions();

// INJECT

// PROPS, EMITS
// const emit = defineEmits(["new-service-area"]);

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
