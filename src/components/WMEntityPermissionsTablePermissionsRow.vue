<template>
  <template v-for="(_, index) in permissionsRef" :key="index">
    <div
      v-if="!filterBy.includes(index)"
      class="cell flex-1 flex align-items-center justify-content-center"
    >
      <Checkbox
        v-model="permissionsRef[index]"
        :binary="true"
        :disabled="isCheckboxDisabled(index)"
      />
    </div>
  </template>
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
  filterBy: {
    type: Array,
    required: true,
  },
});

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC
const permissionsRef = toRef(props, "permissions");

const isCheckboxDisabled = (index) => {
  if (index !== "read" && !permissionsRef.value.read) {
    return true;
  }

  return false;
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped lang="scss">
.cell {
  font-weight: 700;
  padding: 12px;
  background-color: var(--gray-50);
}
</style>
