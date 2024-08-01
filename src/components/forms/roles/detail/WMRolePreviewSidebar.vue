<template>
  <Sidebar
      v-if="props.role"
      v-model:visible="visible"
      class="details-sidebar w-6"
      :show-close-icon="false"
      :class="''"
      @update:model-value="updateModelValue"
  >

    <div class="wm-detail-form-container flex flex-auto flex-column overflow-auto">
      <div class="flex justify-content-between">

        <pre>{{ props.role }}</pre>

      </div>
    </div>

  </Sidebar>
</template>

<script setup>
// IMPORTS
import  { ref } from 'vue';

// DEPENDENCIES

// INJECT

// PROPS, EMITS
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  role: {
    type: Object,
    default: () => {},
  },
});

// REFS
const visible = ref(false);

// COMPUTED

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
