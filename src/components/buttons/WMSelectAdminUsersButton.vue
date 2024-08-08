<template>
  <WMButton :text="$t('buttons.link_users')" type="type-4" @click="toggle">
    <template #customIcon>
      <div class="flex" v-html="AccountBoxIcon" />
    </template>
  </WMButton>

  <OverlayPanel
    ref="isOpen"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
    style="width: 300px"
  >
    <div class="flex flex-column gap-2">
      <WMInputSearch
        name="teams"
        :placeholder="$t('team.search-users')"
        :multiple="true"
        width="248"
        :search-function="searchUsers"
        custom-option-label="username"
        :new="true"
        :model-value="selectedUsers"
        @update:model-value="onUsersSelected"
      />

      <WMButton
        :text="$t('buttons.link')"
        type="type-4"
        @click="
          handleSelectUsers();
          closeOverlay();
        "
      />
    </div>
  </OverlayPanel>
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

import AccountBoxIcon from "/icons/account_box.svg?raw";
import { useLayout } from "@/layout/composables/layout";

// DEPENDENCIES
const { layoutConfig } = useLayout();
const { getUsers } = useAdminUsers();

// PROPS, EMITS

const emit = defineEmits(["usersSelected"]);

// REFS
const isOpen = ref();
const selectedUsers = ref([]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const toggle = (event) => {
  isOpen.value.toggle(event);
};

const searchUsers = (query) => {
  return getUsers({ search: query });
};

const onUsersSelected = (users) => {
  selectedUsers.value = users;
};

const closeOverlay = () => {
  isOpen.value.hide();
};

const handleSelectUsers = () => {
  emit("usersSelected", selectedUsers.value);
};

// WATCHERS
// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
