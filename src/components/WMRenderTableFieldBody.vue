<template>
  <!-- Type text -->
  <template v-if="columnData.type == 'text'">
    {{ modelValue }}
  </template>
  <!-- Type project-link -->
  <template v-if="columnData.type == 'link'">
    <router-link
      v-if="modelValue"
      :to="{
        name: columnData.routeName,
        params: { id: modelValue.id },
      }"
    >
      {{ modelValue.text }}
    </router-link>
  </template>
  <!-- Type state -->
  <template v-if="columnData.type == 'state'">
    <WMStateField :state="modelValue" />
  </template>
  <!-- Type tags -->
  <template v-if="columnData.type == 'chips'">
    <div class="flex flex-row gap-2 overflow-x-auto max-w-15rem">
      <Chip v-for="(chip, index) in modelValue" :key="index" :label="chip.name" />
    </div>
  </template>
  <!-- Type option set -->
  <template v-if="columnData.type == 'option-set'">
    <WMOptionSetValue :option-set="modelValue" />
  </template>
</template>
<script setup>
// IMPORTS

// DEPENDENCIES

// INJECT

// PROPS, EMITS
defineProps({
  columnData: Object,
});

const modelValue = defineModel();

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
