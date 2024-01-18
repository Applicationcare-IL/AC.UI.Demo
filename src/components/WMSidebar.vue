<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="wm-sidebar-wrapper"
      :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
      :style="{ left: leftPositon + 'px' }"
    >
      <div ref="target" class="wm-sidebar">
        <slot :props="props" @close-sidebar="handleCloseSidebar" />
      </div>
      <div class="wm-sidebar-overlay" @click="handleCloseSidebar"></div>
    </div>
  </Teleport>
</template>

<script setup>
// IMPORTS
import { computed, provide, ref, toRefs, watch } from "vue";

import { useLayout } from "@/layout/composables/layout";

// DEPENDENCIES
const { activeSidebar, openSidebar, closeSidebar } = useSidebar();
const { layoutConfig } = useLayout();
const { confirmCancelDialog } = useDialog();

// PROPS, EMITS
const props = defineProps({
  name: {
    type: String,
    default: "",
  },
  visible: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["closeSidebar", "openSidebar"]);

// REFS
const target = ref(null);
const { visible } = toRefs(props);
const isFormDirty = ref(false);

// COMPUTED
/**
 * Used to calculate the margin left of the sidebar
 * based on the number of active (and stacked) sidebars
 */
const leftPositon = computed(() => {
  const totalActiveSidebars = activeSidebar.length - 1; // the first sidebar should not have margin

  const space = 20;
  const sidebarPositionInActiveSidebarArray = activeSidebar.indexOf(props.name);
  const totalMargin = totalActiveSidebars * space;

  return totalMargin - sidebarPositionInActiveSidebarArray * space;
});

// COMPONENT METHODS
const handleCloseSidebar = () => {
  if (isFormDirty.value) {
    confirmCancelDialog({ emit });
  } else {
    emit("closeSidebar");
  }
};

const handleOpenSidebar = () => {
  emit("openSidebar");
  // hide all the active dropdowns
  document.querySelectorAll(".p-autocomplete-panel").forEach((dropdown) => {
    dropdown.style.display = "none";
  });
};

// PROVIDE, EXPOSE
provide("closeSidebar", handleCloseSidebar);
provide("isFormDirty", isFormDirty);

// WATCHERS
watch(visible, (value) => {
  if (value) {
    openSidebar(props.name);
  } else {
    closeSidebar(props.name);
  }
});

watch(
  () => activeSidebar,
  (value) => {
    if (value.includes(props.name)) {
      handleOpenSidebar();
    }
  },
  { deep: true }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style>
.wm-sidebar-wrapper {
  position: fixed;
  height: 100%;
  left: 0px;
  top: 0px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  z-index: 950;
  min-width: 400px;
  overflow-y: auto;
  background: white;
  transition: all 0.3s ease-in-out;
}

.wm-sidebar-overlay {
  content: "";
  width: 100%;
  height: 100%;
  background-color: #42424275;
  position: fixed;
  z-index: -1;
  left: 0;
}

.wm-sidebar {
  border-top-right-radius: 20px;
  background: #ffffff;
  color: #495057;
  border: 0 none;
  box-shadow: 0 0 14px 0 rgba(0, 0, 0, 0.1);
  height: 100vh;
  width: 100%;
  overflow: scroll;
}
</style>
