<template>
  <div class="flex flex-row flex-wrap flex-column">
    <p class="h2">Entity permissions</p>
    <WMEntityPermissionsTable :permissions="permissions.entities" />
  </div>
  <div class="flex flex-row flex-wrap flex-column">
    <p class="h2">General permissions</p>
    <div class="flex gap-5">
      <div class="flex flex-column gap-5 flex-1">
        <WMPermissionSection title="Dashboard">
          <template #custom-content> TO-DO </template>
        </WMPermissionSection>
        <WMPermissionSection title="Admin permissions" :permissions="permissions.admin" />
        <WMPermissionSection
          title="Actions"
          :permissions="permissions.actions"
          clear-all
          select-all
        />
      </div>
      <div class="flex flex-column gap-5 flex-1">
        <WMPermissionSection
          title="Sale discounts"
          :permissions="permissions.sale_discounts"
          clear-all
          select-all
        />
        <WMPermissionSection
          title="Documents types"
          :permissions="permissions.document_types"
          clear-all
          select-all
        />
      </div>
      <div class="flex flex-column gap-5 flex-1">
        <WMPermissionSection
          title="Service areas"
          :permissions="permissions.service_area"
          clear-all
          select-all
        />
      </div>
    </div>
  </div>
</template>

<script setup>
// IMPORTS

// DEPENDENCIES

// INJECT

// PROPS, EMITS
defineProps({
  permissions: {
    type: Object,
    required: true,
  },
});

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
