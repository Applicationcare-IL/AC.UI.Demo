<template>
  <h1 class="h1 capitalize">{{ props.entity }}</h1>
  <Divider/>
  <div class="flex gap-2">
    <WMSelectableButtonGroup
        :name="props.entity"
        :options="options"
        @update:selected-option="changeSelectorValue"
    />
  </div>
</template>

<script setup>
// IMPORTS

// DEPENDENCIES

// INJECT

// PROPS, EMITS
const props = defineProps({
  entity: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(["update:selectedOption"]);

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC
const changeSelectorValue = (value) => {
  emit("update:selectedOption", value);
}

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
