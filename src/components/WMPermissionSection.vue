<template>
  <div class="entity-permissions">
    <div class="entity-permissions__header">
      <div class="cell w-full flex justify-content-between">
        <div>{{ title }}</div>
      </div>
    </div>
    <!-- <div class="entity-permissions__subheader">
      <div class="cell w-full">test</div>
    </div> -->
    <template v-for="(_, index) in permissionsRef" :key="index">
      <div class="entity-permissions__entity-column">
        <div class="cell w-full flex justify-content-between align-items-center">
          <InputSwitch v-model="permissionsRef[index]" />
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
});

// REFS
const slots = useSlots();

const permissionsRef = toRef(props, "permissions");

// COMPUTED

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped lang="scss"></style>
