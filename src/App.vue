<template>
  <div v-if="loading" class="flex flex-column justify-content-center h-screen align-items-center">
    <ProgressSpinner />
  </div>
  <router-view v-else />
  <ConfirmDialog :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''" />
  <!-- why is this here? https://stackoverflow.com/questions/74525054/primevue-confirmdialog-opens-multiple-times -->
  <WMIncomingCallDialog
    v-if="showIncomingCallDialog"
    v-model="showIncomingCallDialog"
    :call-data="callData"
  />

  <Command.Dialog
    v-if="can('global.admin_zone')"
    :visible="visible"
    theme="raycast"
    @select-item="handleCommand"
  >
    <template #header>
      <Command.Input v-model:value="inputValue" placeholder="Type a command or search..." />
    </template>
    <template #body>
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>

        <Command.Group>
          <template v-for="option in paletteOptions" :key="option.label">
            <Command.Item :data-value="option.to">
              <img :src="option.image" alt="icon" />
              {{ $t(option.label) }}
            </Command.Item>
          </template>
        </Command.Group>
      </Command.List>
    </template>
  </Command.Dialog>
</template>

<script setup>
// IMPORTS
import { useMagicKeys } from "@vueuse/core";
import { computed, onMounted, ref } from "vue";
import { watch } from "vue";
import { Command } from "vue-command-palette";
import { useRouter } from "vue-router";

import { useLayout } from "@/layout/composables/layout";
import { useAuthStore } from "@/stores/auth";
import { usePermissionsStore } from "@/stores/permissionsStore";

import WMIncomingCallDialog from "./components/dialogs/WMIncomingCallDialog.vue";

// DEPENDENCIES
const authStore = useAuthStore();
const { layoutConfig } = useLayout();
const { getLicensing } = useLicensing();
const permissionsStore = usePermissionsStore();
const { can } = usePermissions();
const router = useRouter();

// INJECT

// PROPS, EMITS

// REFS
const loadingPermissions = ref(true);
const showIncomingCallDialog = ref(false);
const callData = ref(null);

// COMMAND PALLETE
const visible = ref(false);
const keys = useMagicKeys();
const CmdK = keys["Meta+K"];
const CtrlK = keys["Control+K"];
const ESC = keys["Escape"];
const inputValue = ref("");

const paletteOptions = [
  {
    label: "navigation.dashboard",
    to: "/dashboard",
    image: new URL("/icons/nav/dashboard.svg", import.meta.url).href,
  },
  {
    label: "navigation.customers",
    to: "/customers",
    image: new URL("/icons/nav/customers.svg", import.meta.url).href,
  },
  {
    label: "navigation.contacts",
    to: "/contacts",
    image: new URL("/icons/nav/contacts.svg", import.meta.url).href,
  },
  {
    label: "navigation.services",
    to: "/services",
    image: new URL("/icons/nav/services.svg", import.meta.url).href,
  },
  {
    label: "navigation.tasks",
    to: "/tasks",
    image: new URL("/icons/nav/tasks.svg", import.meta.url).href,
  },
  {
    label: "navigation.projects",
    to: "/projects",
    image: new URL("/icons/nav/projects.svg", import.meta.url).href,
  },
  {
    label: "navigation.sales",
    to: "/sales",
    image: new URL("/icons/nav/sales.svg", import.meta.url).href,
  },
  {
    label: "navigation.products",
    to: "/products",
    image: new URL("/icons/nav/products.svg", import.meta.url).href,
  },
  {
    label: "navigation.assets",
    to: "/assets_list",
    image: new URL("/icons/nav/assets.svg", import.meta.url).href,
  },
  {
    label: "navigation.reports",
    to: "/reports",
    image: new URL("/icons/nav/reports.svg", import.meta.url).href,
  },
  {
    label: "navigation.projects-report",
    to: "/projects-report",
    image: new URL("/icons/nav/reports.svg", import.meta.url).href,
  },
  // ADMIN
  {
    label: "Admin Users",
    to: "/admin/users",
    image: new URL("/icons/nav/person.svg", import.meta.url).href,
  },
  {
    label: "Admin Teams",
    to: "/admin/teams",
    image: new URL("/icons/nav/groups.svg", import.meta.url).href,
  },
  {
    label: "Admin Roles",
    to: "/admin/roles",
    image: new URL("/icons/nav/badge.svg", import.meta.url).href,
  },
  {
    label: "Admin Permissions",
    to: "/admin/permissions",
    image: new URL("/icons/nav/clinical_notes.svg", import.meta.url).href,
  },
  {
    label: "Admin Classifications",
    to: "/admin/classifications",
    image: new URL("/icons/nav/category.svg", import.meta.url).href,
  },
  {
    label: "Admin SLA Settings",
    to: "/admin/sla-settings",
    image: new URL("/icons/nav/alarm.svg", import.meta.url).href,
  },
  {
    label: "Admin Quick Codes",
    to: "/admin/quick-codes",
    image: new URL("/icons/nav/bolt.svg", import.meta.url).href,
  },
  {
    label: "Admin Messages",
    to: "/admin/messages",
    image: new URL("/icons/nav/comment.svg", import.meta.url).href,
  },
];

// COMPUTED
const loading = computed(() => loadingPermissions.value);

// COMPONENT METHODS AND LOGIC
if (window.Echo) {
  window.Echo.channel(`employee.${authStore.user?.virtual_extension}`).listen(
    ".call.incoming",
    (data) => {
      showIncomingCallDialog.value = true;
      callData.value = data;
    }
  );
}

const handleCommand = (command) => {
  router.push(command.value);
  visible.value = false;
  return;
};

// PROVIDE, EXPOSE

// WATCHERS
watch(CtrlK);

watch(CmdK, (v) => {
  if (v) {
    if (visible.value) {
      visible.value = false;
    } else {
      visible.value = true;
    }
  }
});

watch(ESC, (v) => {
  if (v) {
    visible.value = false;
  }
});

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  if (authStore.isAuthenticated) {
    getLicensing();

    if (!permissionsStore.isPermissionsLoaded) {
      loadingPermissions.value = await permissionsStore.fetchPermissionsFromApi();
    } else {
      loadingPermissions.value = false;
    }
  } else {
    loadingPermissions.value = false;
  }
});
</script>

<style lang="scss">
// COMMAND PALETTE
div [command-dialog-mask] {
  background-color: rgba(0, 0, 0, 0.3);
  height: 100vh;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 99999999;
  animation: 333ms cubic-bezier(0.16, 1, 0.3, 1) 0s 1 normal none running shown;
}

div [command-dialog-wrapper] {
  position: relative;
  background: var(--gray2);
  border-radius: 6px;
  box-shadow: none;
  flex-direction: column;
  margin: 20vh auto auto;
  max-width: 560px;
  animation: 333ms cubic-bezier(0.16, 1, 0.3, 1) 0s 1 normal none running shown;
}

div [command-dialog-footer] {
  border-top: 1px solid var(--gray6);
  align-items: center;
  background: var(--gray4);
  color: var(--gray11);
  border-radius: 0 0 8px 8px;
  box-shadow: none;
  display: flex;
  flex-direction: row-reverse;
  flex-shrink: 0;
  height: 44px;
  justify-content: space-between;
  padding: 0 12px;
  position: relative;
  user-select: none;
  width: 100%;
  z-index: 300;
  font-size: 12px;
}

.raycast {
  --app-bg: var(--gray1);
  --app-text: #000000;
  --command-shadow: 0 16px 70px rgb(0 0 0 / 20%);

  --lowContrast: #ffffff;
  --highContrast: #000000;
  --vcp-c-brand: #44bd87;
  --vcp-c-accent: #35495e;

  --gray1: hsl(0, 0%, 98%);
  --gray2: hsl(0, 0%, 97.3%);
  --gray3: hsl(0, 0%, 95.1%);
  --gray4: hsl(0, 0%, 93%);
  --gray5: hsl(0, 0%, 90.9%);
  --gray6: hsl(0, 0%, 88.7%);
  --gray7: hsl(0, 0%, 85.8%);
  --gray8: hsl(0, 0%, 78%);
  --gray9: hsl(0, 0%, 56.1%);
  --gray10: hsl(0, 0%, 52.3%);
  --gray11: hsl(0, 0%, 43.5%);
  --gray12: hsl(0, 0%, 9%);

  --grayA1: hsla(0, 0%, 0%, 0.012);
  --grayA2: hsla(0, 0%, 0%, 0.027);
  --grayA3: hsla(0, 0%, 0%, 0.047);
  --grayA4: hsla(0, 0%, 0%, 0.071);
  --grayA5: hsla(0, 0%, 0%, 0.09);
  --grayA6: hsla(0, 0%, 0%, 0.114);
  --grayA7: hsla(0, 0%, 0%, 0.141);
  --grayA8: hsla(0, 0%, 0%, 0.22);
  --grayA9: hsla(0, 0%, 0%, 0.439);
  --grayA10: hsla(0, 0%, 0%, 0.478);
  --grayA11: hsla(0, 0%, 0%, 0.565);
  --grayA12: hsla(0, 0%, 0%, 0.91);

  --blue1: hsl(206, 100%, 99.2%);
  --blue2: hsl(210, 100%, 98%);
  --blue3: hsl(209, 100%, 96.5%);
  --blue4: hsl(210, 98.8%, 94%);
  --blue5: hsl(209, 95%, 90.1%);
  --blue6: hsl(209, 81.2%, 84.5%);
  --blue7: hsl(208, 77.5%, 76.9%);
  --blue8: hsl(206, 81.9%, 65.3%);
  --blue9: hsl(206, 100%, 50%);
  --blue10: hsl(208, 100%, 47.3%);
  --blue11: hsl(211, 100%, 43.2%);
  --blue12: hsl(211, 100%, 15%);

  [command-dialog-wrapper] {
    max-width: 640px;
    width: 100%;
    background: var(--gray1);
    border-radius: 12px;
    padding: 8px 0;
    font-family: var(--font-sans);
    box-shadow: var(--command-shadow);
    border: 1px solid var(--gray6);
    position: relative;

    .dark & {
      background: var(--gray2);
      border: 0;

      &:after {
        content: "";
        background: linear-gradient(
          to right,
          var(--gray6) 20%,
          var(--gray6) 40%,
          var(--gray10) 50%,
          var(--gray10) 55%,
          var(--gray6) 70%,
          var(--gray6) 100%
        );
        z-index: -1;
        position: absolute;
        border-radius: 12px;
        top: -1px;
        left: -1px;
        width: calc(100% + 2px);
        height: calc(100% + 2px);
        animation: shine 3s ease forwards 0.1s;
        background-size: 200% auto;
      }

      &:before {
        content: "";
        z-index: -1;
        position: absolute;
        border-radius: 12px;
        top: -1px;
        left: -1px;
        width: calc(100% + 2px);
        height: calc(100% + 2px);
        box-shadow: 0 0 0 1px transparent;
        animation: border 1s linear forwards 0.5s;
      }
    }

    kbd {
      font-family: var(--font-sans);
      background: var(--gray3);
      color: var(--gray11);
      height: 20px;
      width: 20px;
      border-radius: 4px;
      padding: 0 4px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:first-of-type {
        margin-left: 8px;
      }
    }
  }

  [command-input] {
    font-family: var(--font-sans);
    border: none;
    width: 100%;
    font-size: 15px;
    padding: 8px 16px;
    outline: none;
    background: var(--bg);
    color: var(--gray12);

    &::placeholder {
      color: var(--gray9);
    }
  }

  [command-raycast-top-shine] {
    .dark & {
      background: linear-gradient(
        90deg,
        rgba(56, 189, 248, 0),
        var(--gray5) 20%,
        var(--gray9) 67.19%,
        rgba(236, 72, 153, 0)
      );
      height: 1px;
      position: absolute;
      top: -1px;
      width: 100%;
      z-index: -1;
      opacity: 0;
      animation: showTopShine 0.1s ease forwards 0.2s;
    }
  }

  [command-raycast-loader] {
    --loader-color: var(--gray9);
    border: 0;
    width: 100%;
    width: 100%;
    left: 0;
    height: 1px;
    background: var(--gray6);
    position: relative;
    overflow: visible;
    display: block;
    margin-top: 12px;
    margin-bottom: 12px;

    &:after {
      content: "";
      width: 50%;
      height: 1px;
      position: absolute;
      background: linear-gradient(90deg, transparent 0%, var(--loader-color) 50%, transparent 100%);
      top: -1px;
      opacity: 0;
      animation-duration: 1.5s;
      animation-delay: 1s;
      animation-timing-function: ease;
      animation-name: loading;
    }
  }

  [command-item] {
    content-visibility: auto;

    cursor: pointer;
    height: 40px;
    border-radius: 8px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 8px;
    color: var(--gray12);
    user-select: none;
    will-change: background, color;
    transition: all 150ms ease;
    transition-property: none;

    &[aria-selected="true"] {
      background: var(--gray4);
      color: var(--gray12);
    }

    &[aria-disabled="true"] {
      color: var(--gray8);
      cursor: not-allowed;
    }

    &:active {
      transition-property: background;
      background: var(--gray4);
    }

    &:first-child {
      margin-top: 8px;
    }

    & + [command-item] {
      margin-top: 4px;
    }

    svg {
      width: 18px;
      height: 18px;
    }
  }

  [command-raycast-meta] {
    margin-left: auto;
    color: var(--gray11);
    font-size: 13px;
  }

  [command-list] {
    padding: 0 8px;
    height: var(--cmd-list-height);
    overflow: auto;
    overscroll-behavior: contain;
    scroll-padding-block-end: 48px;
    transition: 100ms ease;
    transition-property: height;
    padding-bottom: 40px;
  }

  [command-raycast-open-trigger],
  [command-raycast-subcommand-trigger] {
    color: var(--gray11);
    background: var(--grayA5);
    padding: 0px 4px 0px 8px;
    border-radius: 6px;
    font-weight: 500;
    font-size: 12px;
    height: 28px;
    letter-spacing: -0.25px;
  }

  [command-raycast-clipboard-icon],
  [command-raycast-hammer-icon] {
    width: 20px;
    height: 20px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;

    svg {
      width: 14px;
      height: 14px;
    }
  }

  [command-raycast-clipboard-icon] {
    background: linear-gradient(to bottom, #f55354, #eb4646);
  }

  [command-raycast-hammer-icon] {
    background: linear-gradient(to bottom, #6cb9a3, #2c6459);
  }

  [command-raycast-open-trigger] {
    display: flex;
    align-items: center;
    color: var(--gray12);
  }

  [command-raycast-subcommand-trigger] {
    display: flex;
    align-items: center;
    gap: 4px;
    right: 8px;
    bottom: 8px;

    svg {
      width: 14px;
      height: 14px;
    }

    hr {
      height: 100%;
      background: var(--gray6);
      border: 0;
      width: 1px;
    }

    &[aria-expanded="true"],
    &:hover {
      background: var(--gray4);

      kbd {
        background: var(--gray7);
      }
    }
  }

  [command-separator] {
    height: 1px;
    width: 100%;
    background: var(--gray5);
    margin: 4px 0;
  }

  * + [command-group] {
    margin-top: 8px;
  }

  [command-group-heading] {
    user-select: none;
    font-size: 12px;
    color: var(--gray11);
    padding: 0 8px;
    display: flex;
    align-items: center;
  }

  [command-dialog-footer] {
    display: flex;
    flex-direction: row;
    height: 40px;
    align-items: center;
    width: 100%;
    position: absolute;
    background: var(--gray1);
    bottom: 0;
    padding: 8px;
    border-top: 1px solid var(--gray6);
    border-radius: 0 0 12px 12px;

    svg {
      width: 20px;
      height: 20px;
      filter: grayscale(1);
      margin-right: auto;
    }

    hr {
      height: 12px;
      width: 1px;
      border: 0;
      background: var(--gray6);
      margin: 0 4px 0px 12px;
    }

    @media (prefers-color-scheme: dark) {
      background: var(--gray2);
    }
  }

  [command-popover] {
    z-index: var(--layer-portal);
    position: fixed;
    left: 50%;
    top: var(--page-top);
    transform: translateX(-50%);

    [command] {
      width: 640px;
      transform-origin: center center;
      animation: dialogIn var(--transition-fast) forwards;
    }

    &[data-state="closed"] [command] {
      animation: dialogOut var(--transition-fast) forwards;
    }
  }

  [command-empty] {
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
    white-space: pre-wrap;
    color: var(--gray11);
  }
}

@keyframes loading {
  0% {
    opacity: 0;
    transform: translateX(0);
  }

  50% {
    opacity: 1;
    transform: translateX(100%);
  }

  100% {
    opacity: 0;
    transform: translateX(0);
  }
}

@keyframes shine {
  to {
    background-position: 200% center;
    opacity: 0;
  }
}

@keyframes border {
  to {
    box-shadow: 0 0 0 1px var(--gray6);
  }
}

@keyframes showTopShine {
  to {
    opacity: 1;
  }
}

.raycast-submenu {
  [command-root] {
    display: flex;
    flex-direction: column;
    width: 320px;
    border: 1px solid var(--gray6);
    background: var(--gray2);
    border-radius: 8px;
  }

  [command-list] {
    padding: 8px;
    overflow: auto;
    overscroll-behavior: contain;
    transition: 100ms ease;
    transition-property: height;
  }

  [command-item] {
    height: 40px;

    cursor: pointer;
    height: 40px;
    border-radius: 8px;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 8px;
    color: var(--gray12);
    user-select: none;
    will-change: background, color;
    transition: all 150ms ease;
    transition-property: none;

    &[aria-selected="true"] {
      background: var(--gray5);
      color: var(--gray12);

      [command-raycast-submenu-shortcuts] kbd {
        background: var(--gray7);
      }
    }

    &[aria-disabled="true"] {
      color: var(--gray8);
      cursor: not-allowed;
    }

    svg {
      width: 16px;
      height: 16px;
    }

    [command-raycast-submenu-shortcuts] {
      display: flex;
      margin-left: auto;
      gap: 2px;

      kbd {
        font-family: var(--font-sans);
        background: var(--gray5);
        color: var(--gray11);
        height: 20px;
        width: 20px;
        border-radius: 4px;
        padding: 0 4px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;

        &:first-of-type {
          margin-left: 8px;
        }
      }
    }
  }

  [command-group-heading] {
    text-transform: capitalize;
    font-size: 12px;
    color: var(--gray11);
    font-weight: 500;
    margin-bottom: 8px;
    margin-top: 8px;
    margin-left: 4px;
  }

  [command-input] {
    padding: 12px;
    font-family: var(--font-sans);
    border: 0;
    border-top: 1px solid var(--gray6);
    font-size: 13px;
    background: transparent;
    margin-top: auto;
    width: 100%;
    outline: 0;
    border-radius: 0;
  }

  animation-duration: 0.2s;
  animation-timing-function: ease;
  animation-fill-mode: forwards;
  transform-origin: var(--radix-popover-content-transform-origin);

  &[data-state="open"] {
    animation-name: slideIn;
  }

  &[data-state="closed"] {
    animation-name: slideOut;
  }

  [command-empty] {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
    white-space: pre-wrap;
    font-size: 14px;
    color: var(--gray11);
  }
}

@keyframes slideIn {
  0% {
    opacity: 0;
    transform: scale(0.96);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideOut {
  0% {
    opacity: 1;
    transform: scale(1);
  }

  100% {
    opacity: 0;
    transform: scale(0.96);
  }
}

@media (max-width: 640px) {
  .raycast {
    [command-input] {
      font-size: 16px;
    }
  }
}
</style>
