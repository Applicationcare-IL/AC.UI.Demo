<template>
  <h1 class="h1">{{ upperFirst(props.entity) }}</h1>
  <Divider/>
  <div class="flex gap-2">
    <WMSelectableButtonGroup
        :name="props.entity"
        :options="options"
        @change="changeSelectorValue"
    />
  </div>
</template>

<script setup>
// IMPORTS

// DEPENDENCIES

// INJECT

// PROPS, EMITS
import {upperFirst} from "scule";

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

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC
const changeSelectorValue = (value) => {
  console.log(value);
}

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
