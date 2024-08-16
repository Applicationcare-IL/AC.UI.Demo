<template>
  <div class="entity-permissions">
    <div class="entity-permissions__header">
      <div class="cell w-full flex justify-content-between">
        <div>{{ title }}</div>
        <div class="flex gap-3 align-items-center">
          <WMButton
            v-if="clearAll"
            :text="$t('buttons.clear-all')"
            type="clear mx-0 px-0"
            @click="clearAllPermissions"
          />
          <WMButton
            v-if="selectAll"
            :text="$t('buttons.select-all')"
            type="primary"
            size="small"
            @click="selectAllPermissions"
          />
        </div>
      </div>
    </div>
    <template v-for="(_, index) in permissionsRef" :key="index">
      <div class="entity-permissions__entity-column">
        <div class="cell w-full flex justify-content-between align-items-center">
          <InputSwitch
            v-model="permissionsRef[index].value"
            :disabled="permissionsRef[index].disabled"
          />
          <span>
            {{ index }}
          </span>
        </div>
      </div>
    </template>
    <template v-if="slots['custom-content']">
      <div class="entity-permissions__entity-column">
        <div class="cell w-full">
          <slot name="custom-content" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
// IMPORTS
import { toRef, useSlots } from "vue";

// DEPENDENCIES

// INJECT

// PROPS, EMITS
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  permissions: {
    type: Array,
    required: true,
  },
  clearAll: {
    type: Boolean,
    default: false,
  },
  selectAll: {
    type: Boolean,
    default: false,
  },
});

// REFS
const slots = useSlots();

const permissionsRef = toRef(props, "permissions");

// COMPUTED

// COMPONENT METHODS AND LOGIC
const clearAllPermissions = () => {
  for (const key in permissionsRef.value) {
    if (permissionsRef.value[key].disabled) {
      continue;
    }

    permissionsRef.value[key].value = false;
  }
};

const selectAllPermissions = () => {
  for (const key in permissionsRef.value) {
    if (permissionsRef.value[key].disabled) {
      continue;
    }

    permissionsRef.value[key].value = true;
  }
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped lang="scss"></style>
