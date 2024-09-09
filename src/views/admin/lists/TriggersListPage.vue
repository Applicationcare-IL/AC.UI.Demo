<template>
  <WMListSubHeader
      entity="trigger"
      :total-records="0"
      :show-communications="false"
      :has-action-builder="false"
      @new="toggleSidebarVisibility"
  >
    <template #top-left>
      <WMStateToggle entity="trigger"/>
    </template>
  </WMListSubHeader>

  <WMSidebar :visible="isVisible" name="newTrigger" @close-sidebar="closeSidebar">
    <template v-if="can('triggers.create')">
      <WMNewEntityFormHeader entity="trigger" name="newTrigger"/>
      <WMNewTriggerForm
          :is-sidebar="true"
          @close-sidebar="closeSidebar"
          @new-trigger-created="handleNewTriggerCreated"
      />
    </template>
    <template v-else>
      <div class="m-5">
        {{ $t("permissions.you-dont-have-permission") }}
      </div>
    </template>
  </WMSidebar>
</template>

<script setup>
// IMPORTS
import {onMounted, ref} from "vue";
import {useUtilsStore} from "@/stores/utils";

// DEPENDENCIES
const {can} = usePermissions();
const utilsStore = useUtilsStore();

// INJECT

// PROPS, EMITS

// REFS

const isVisible = ref(false);

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Triggers",
});

const toggleSidebarVisibility = () => {
  isVisible.value = !isVisible.value;
};

const closeSidebar = () => {
  isVisible.value = false;
};

const handleNewTriggerCreated = () => {
  adminTriggerTable.value.loadLazyData();
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  utilsStore.entity = "trigger";

});
</script>

<style scoped lang="scss"></style>
