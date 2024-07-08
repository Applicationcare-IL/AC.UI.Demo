<template>
  <WMListSubHeader
      entity="employee"
      :total-records="0"
      @new="toggleSidebarVisibility"
      :showSearchBar="false"
      :showFilterButton="false"
  >
  </WMListSubHeader>

  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">tabla</div>
</template>

<script setup>
// IMPORTS
import {useUtilsStore} from "@/stores/utils";
import {onMounted} from "vue";

// DEPENDENCIES
const utilsStore = useUtilsStore();

// INJECT

// PROPS, EMITS

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Teams",
});

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  utilsStore.entity = "team";
});

</script>

<style scoped lang="scss"></style>
