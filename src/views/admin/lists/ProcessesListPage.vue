<template>
  <div class="m-5">
    <WIP />
    <!--  <WMListSelector-->
    <!--      entity="processes"-->
    <!--      :options="options"-->
    <!--      @update:selected-option="changeSelectedOption"-->
    <!--  />-->
    <!--  <span v-if="selectedOption === 'service'">Opcion service</span>-->
    <!--  <span v-if="selectedOption === 'sales'">Opcion sales</span>-->
    <!--  <span v-if="selectedOption === 'project'">Opcion project</span>-->
  </div>
</template>

<script setup>
// IMPORTS
import {ref} from 'vue';

// DEPENDENCIES

// INJECT

// PROPS, EMITS

// REFS
const options = [{value: 'service', label: 'Processes service'}, {
  value: 'sales',
  label: 'Processes sales'
}, {value: 'project', label: 'Processes project'}]

const selectedOption = ref();

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Processes",
});

const changeSelectedOption = (option) => {
  selectedOption.value = option.value;
}


// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped lang="scss"></style>
