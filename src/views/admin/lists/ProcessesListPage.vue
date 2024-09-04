<template>
  <div class="m-5">
    <WIP />
  </div>
  <WMListSelector
      entity="processes"
      :options="options"

  />
</template>

<script setup>
// IMPORTS

// DEPENDENCIES

// INJECT

// PROPS, EMITS

// REFS
const options = [{value: 'service', label: 'Processes service'}, {
  value: 'sales',
  label: 'Processes sales'
}, {value: 'project', label: 'Processes project'}]
// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Processes",
});


// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped lang="scss"></style>
