<template>
  <div class="overflow-scroll">
    <div v-if="Object.keys(permissionsRef).length > 0" class="entity-permissions">
      <div class="entity-permissions__header">
        <div class="cell w-entity-column sticky right-0">{{ $t("permissions.entity") }}</div>
        <div class="cell w-access-column">{{ $t("permissions.access-level") }}</div>
        <div class="cell flex-1">{{ $t("permissions.permissions") }}</div>
      </div>
      <div class="entity-permissions__subheader">
        <div class="cell w-entity-column sticky right-0"></div>
        <div class="cell w-access-column"></div>

        <div class="flex w-permissions-column gap-1">
          <template v-for="(headerText, index) in tableHeaders" :key="index">
            <div class="cell flex-1 flex justify-content-center">{{ headerText }}</div>
          </template>
        </div>
      </div>
      <template v-for="(permission, index) in permissionsRef" :key="index">
        <div class="entity-permissions__entity-column">
          <div class="cell w-entity-column bg-gray-100 sticky right-0">{{ index }}</div>
          <div class="cell w-access-column">
            <div class="flex justify-content-between gap-5">
              <div>
                <WMEntityPermissionsAccessLevelSelector :permissions="permission" />
              </div>
              <div class="flex gap-2 align-items-center">
                <span>Related</span>
                <InputSwitch v-model="permissionsRef[index].related"/>
              </div>
            </div>
          </div>
          <div class="flex gap-1 w-permissions-column">
            <WMEntityPermissionsTablePermissionsRow
                :permissions="permission"
                :filter-by="filterHeaderKeys"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import {computed, toRef} from "vue";
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
const filterHeaderKeys = ["all", "my_team", "my", "related"];

// COMPUTED

/**
 * We need to get and filter keys from the list because they will be used in the "Access Level" column
 * and not in the "Permissions" column
 */
const tableHeaders = computed(() => {
  const permissionsKeys = Object.keys(props.permissions);
  const permissionFirstKey = permissionsKeys[0];

  const keys = Object.keys(props.permissions[permissionFirstKey]);

  return keys.filter((key) => !filterHeaderKeys.includes(key));
});

// COMPONENT METHODS AND LOGIC
const permissionsRef = toRef(props, "permissions");

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped lang="scss"></style>
