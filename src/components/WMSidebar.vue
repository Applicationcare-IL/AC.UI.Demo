<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="wm-sidebar-wrapper"
      :style="{ left: leftPositon + 'px' }"
    >
      <div class="wm-sidebar" ref="target">
        <slot></slot>

        <button @click="closeSidebar">Close sidebar</button>
      </div>
      <div class="wm-sidebar-overlay" @click="closeSidebar"></div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, toRefs, defineEmits, watch, computed } from "vue";
import { useSidebarStore } from "@/stores/sidebar";
const sidebarStore = useSidebarStore();

const target = ref(null);

const props = defineProps({
  name: {
    type: String,
    default: "",
  },
  visible: {
    type: Boolean,
    default: false,
  },
});

const { visible } = toRefs(props);

const emit = defineEmits(["closeSidebar"]);

const closeSidebar = () => {
  emit("closeSidebar");
};

const openSidebar = () => {
  emit("openSidebar");
  // hide all the active dropdowns
  document.querySelectorAll(".p-autocomplete-panel").forEach((dropdown) => {
    dropdown.style.display = "none";
  });
};

/* Used to calculate the margin left of the sidebar
   based on the number of active (and stacked) sidebars */
const leftPositon = computed(() => {
  const totalActiveSidebars = sidebarStore.activeSidebar.length - 1; // the first sidebar should not have margin

  const space = 20;
  const sidebarPositionInActiveSidebarArray =
    sidebarStore.activeSidebar.indexOf(props.name);
  const totalMargin = totalActiveSidebars * space;

  return totalMargin - sidebarPositionInActiveSidebarArray * space;
});

watch(visible, (value) => {
  if (value) {
    sidebarStore.openSidebar(props.name);
  } else {
    sidebarStore.closeSidebar(props.name);
  }
});

watch(
  () => sidebarStore.activeSidebar,
  (value) => {
    console.log("changes", value);
    if (value.includes(props.name)) {
      console.log("open");
      openSidebar();
    } else {
      console.log("close");
      closeSidebar();
    }
  },
  { deep: true }
);
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
