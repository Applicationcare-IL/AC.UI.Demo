<template>
  <Sidebar
    v-if="props.classification"
    v-model:visible="visible"
    class="details-sidebar w-4"
    :show-close-icon="false"
  >
    <div class="flex flex-auto flex-column overflow-auto w-full px-2">
      <div class="flex justify-content-between">
        <h2 class="h2 mb-0">Classification: {{ classification.service_area_name }}</h2>
        <WMButton
          :text="
            classification.state.id === activeStateId
              ? $t('buttons.deactivate')
              : $t('buttons.activate')
          "
          type="secondary"
          @click="handleActivateDeactivate"
        />
      </div>
      <Divider />

      <pre>{{ classification }}</pre>
    </div>
  </Sidebar>
</template>

<script setup>
// IMPORTS
import { onMounted, ref } from "vue";

import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const optionSetsStore = useOptionSetsStore();
const { activateOptionSet, deactivateOptionSet } = useAdminOptionSets();
const toast = useToast();

// INJECT

// PROPS, EMITS
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  classification: {
    type: Object,
    default: () => {},
  },
});

// REFS
const visible = ref(false);
const activeStateId = ref(null);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const handleActivateDeactivate = () => {
  if (props.classification.state.id === activeStateId.value) {
    deactivateOptionSet(props.classification.id);
    toast.success({ message: "Classification deactivated" });
  } else {
    activateOptionSet(props.classification.id);
    toast.success({ message: "Classification activated" });
  }
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  activeStateId.value = await optionSetsStore.getId("state", "active");
});
</script>

<style scoped></style>
