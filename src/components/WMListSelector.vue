<template>
  <div class="pb-0 " style="padding: 18px 48px;">
    <h1 class="h1 capitalize">{{ props.entity }}</h1>
    <Divider/>
    <div class="flex gap-2">
      <WMSelectableButtonGroup
          :name="props.entity"
          :options="options"
          :value="options[0].value"
          @update:selected-option="changeSelectorValue"
      />
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import {onMounted} from "vue";
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
onMounted(() => {

})
</script>

<style scoped></style>
