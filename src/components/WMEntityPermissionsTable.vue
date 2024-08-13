<template>
  <!-- <pre v-if="permissionsRef">{{ permissionsRef.contacts }}</pre> -->

  <div v-if="Object.keys(permissionsRef).length > 0" class="entity-permissions">
    <div class="entity-permissions__header">
      <div class="cell w-entity-column">{{ $t("permissions.entity") }}</div>
      <div class="cell w-access-column">{{ $t("permissions.access-level") }}</div>
      <div class="cell flex-1">{{ $t("permissions.permissions") }}</div>
    </div>
    <div class="entity-permissions__subheader">
      <div class="cell w-entity-column"></div>
      <div class="cell w-access-column"></div>
      <div class="flex w-permissions-column gap-1">
        <template v-for="(_, index) in permissionsRef.contacts" :key="index">
          <div class="cell flex-1">{{ index }}</div>
        </template>
      </div>
    </div>
    <template v-for="(permission, index) in permissionsRef" :key="index">
      <div class="entity-permissions__entity-column">
        <div class="cell w-entity-column bg-gray-100">{{ index }}</div>
        <div class="cell w-access-column"></div>
        <div class="flex gap-1 w-permissions-column">
          <WMEntityPermissionsTablePermissionsRow :permissions="permission" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
// IMPORTS
import { toRef } from "vue";
// DEPENDENCIES

// INJECT

// PROPS, EMITS
const props = defineProps({
  permissions: {
    type: Array,
    required: true,
  },
});

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC
const permissionsRef = toRef(props, "permissions");

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped lang="scss"></style>
