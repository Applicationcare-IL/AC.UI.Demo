<template>
  <div
    class="flex flex-row"
    :class="{ 'layout-rtl': layoutConfig.isRTL.value }"
  >
    <div class="flex-1 p-3 md:p-6">
      <div class="login-header flex flex-row gap-3 align-items-center">
        <img src="@/assets/images/logo.png" alt="EasyMaze small logo" />
        <img
          src="@/assets/images/easymaze-title.png"
          style="padding-top: 10px; padding-bottom: 5px"
          alt="EasyMaze text logo"
          class="easy-maze-logo"
        />
        <img
          v-if="orgLogo"
          :src="orgLogo"
          alt="Client logo"
          class="client-logo"
        />
      </div>
      <div
        class="flex flex-column justify-content-center align-items-center h-full pb-6"
      >
        <slot></slot>
      </div>
    </div>
    <div class="side-design hidden md:flex flex-1"></div>
  </div>
</template>

<script setup>
import { useLayout } from "@/layout/composables/layout";
const { layoutConfig } = useLayout();

const orgLogo =
  import.meta.env.VITE_ADMIN_URL + "/storage/logos/login.png?cache=false";
</script>

<style scoped>
.side-design {
  background: url("@/assets/images/login-side-design.svg");
  height: 100vh;
}

:deep(.form-container) {
  width: 100%;
  max-width: 300px;
}

@media (min-width: 768px) {
  :deep(.form-container) {
    max-width: 400px;
  }
}

.login-header .client-logo {
  max-width: 130px;
  height: auto;
  margin-right: auto;
}

.easy-maze-logo {
  width: 100px;
  height: auto;
}
</style>
