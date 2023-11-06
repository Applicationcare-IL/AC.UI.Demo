<template>
  <Teleport to="body">
    <div v-if="visible" class="wm-sidebar-wrapper">
      <div class="wm-sidebar" ref="target">
        <slot></slot>

        <button @click="toggleVisibility">Close sidebar</button>
      </div>
      <div class="wm-sidebar-overlay" @click="toggleVisibility"></div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, toRefs, defineEmits } from "vue";

// import { onClickOutside } from "@vueuse/core";

const target = ref(null);

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const { visible } = toRefs(props);

const emit = defineEmits(["closeSidebar"]);

const toggleVisibility = () => {
  emit("closeSidebar");
};

// onClickOutside(target, (event) => {
//   emit("closeSidebar");
// });
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
  z-index: 1000;
  min-width: 400px;
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
  background: #ffffff;
  color: #495057;
  border: 0 none;
  box-shadow: 0 0 14px 0 rgba(0, 0, 0, 0.1);
  height: 100%;
  width: 100%;
}
</style>
