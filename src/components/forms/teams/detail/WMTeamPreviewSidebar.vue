<template>
  <Sidebar
      v-if="props.team"
      v-model:visible="visible"
      class="details-sidebar w-6"
      :show-close-icon="false"
      :class="''"
      @update:model-value="updateModelValue"
  >

    <div class="wm-detail-form-container flex flex-auto flex-column overflow-auto">

      <div class="flex justify-content-between">
        <h2 class="h2">{{ props.team.name }}</h2>
        <router-link
            :to="{
          name: 'adminUserDetail',
          params: { id: props.team.id },
        }"
            class="p-2"
        >
          <Button>Edit</Button>
        </router-link>
      </div>
      <Divider />

      <div class="task-data flex flex-auto flex-column gap-5 mb-5">

        <div class="wm-form-row align-items-end gap-5">
          <div class="wm-form-row gap-5">
            <WMInput
                name="id"
                type="info"
                :highlighted="true"
                :label="$t('id') + ':'"
                :value="props.team.id"
            />
            <WMInput
                name="state"
                type="info"
                :highlighted="true"
                :label="$t('state') + ':'"
                :value="props.team.state.value"
            />
          </div>
        </div>

        <div class="wm-form-row align-items-end gap-5">
          <div class="wm-form-row gap-5">
            <WMInput
                name="state"
                type="info"
                :highlighted="true"
                :label="$t('manager') + ':'"
                :value="props.team.manager_name"
            />
          </div>
        </div>

        <Divider/>

        <WMInputSearch
            name="contact"
            :placeholder="$t('select', ['contact'])"
            type="table"
            :label="$t('contact.contacts') + ':'"
            width="160"
            :highlighted="true"
            :search-function="searchUsers"
            :new="true"
            related-sidebar="newUser"
            :multiple="true"
            @change="onUserSelected"
        />
        <pre>{{ selectedUsers }}</pre>

      </div>
    </div>

  </Sidebar>
</template>

<script setup>
// IMPORTS
import  { ref } from 'vue';
import useAdminUsers from "@/composables/useAdminUsers";

// DEPENDENCIES
const { getUsers } = useAdminUsers();

// INJECT

// PROPS, EMITS
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  team: {
    type: Object,
    default: () => {},
  },
});

// REFS
const visible = ref(false);

const selectedUsers = ref([]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const searchUsers = (query) => {
  let params = {
    per_page: 99999,
    search: query
  }

  return getUsers(params);
}

const onUserSelected = (newUser) => {
  if (selectedUsers.value.some((contact) => contact.id === newUser.value.id)) {
    return;
  }
  selectedUsers.value.push(newUser.value);
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
