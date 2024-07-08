<template>
  <WMListSubHeader
      entity="role"
      :total-records="0"
      @new="toggleSidebarVisibility"
      :showSearchBar="false"
      :showFilterButton="false"
      :hasActionBuilder="false"
  >
  </WMListSubHeader>

  <WMSidebar :visible="isVisible" name="newRole" @close-sidebar="closeSidebar">
    <template v-if="can('teams.create')">
      <WMNewEntityFormHeader entity="role" name="newRole" />
      <!--       <WMNewContactForm :is-sidebar="true" @close-sidebar="closeSidebar" />-->

    </template>
    <template v-else>
      <div class="m-5">
        {{ $t("permissions.you-dont-have-permission") }}
      </div>
    </template>
  </WMSidebar>

  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">tabla</div>

</template>

<script setup>
// IMPORTS
import {useUtilsStore} from "@/stores/utils";
import {onMounted, ref} from "vue";

// DEPENDENCIES
const utilsStore = useUtilsStore();
const { can } = usePermissions();

// INJECT

// PROPS, EMITS

// REFS
const isVisible = ref(false);

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Roles",
});

function toggleSidebarVisibility() {
  isVisible.value = !isVisible.value;
}

function closeSidebar() {
  isVisible.value = false;
}

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  utilsStore.entity = "role";
});

</script>

<style scoped lang="scss"></style>
