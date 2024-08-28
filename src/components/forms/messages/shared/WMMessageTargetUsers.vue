<template>
  <div v-if="loading" class="m-5">
    <ProgressSpinner />
  </div>
  <div v-else class="flex flex-column gap-3">
    <WMInputSearch
      v-if="teams"
      :model-value="selectedTeams"
      name="teams"
      :label="$t('teams') + ':'"
      :placeholder="$t('message.select-teams')"
      :multiple="true"
      size="md"
      :options="teams.data"
      :highlighted="true"
    />

    <WMInputSearch
      v-if="roles"
      :model-value="selectedRoles"
      name="roles"
      :label="$t('roles') + ':'"
      :placeholder="$t('message.select-roles')"
      :multiple="true"
      size="md"
      :options="roles.data"
      :highlighted="true"
    />

    <WMInputSearch
      v-if="users"
      :model-value="selectedUsers"
      name="users"
      :label="$t('users') + ':'"
      :placeholder="$t('message.select-users')"
      :multiple="true"
      size="md"
      :options="users.data"
      :highlighted="true"
    />
  </div>
</template>

<script setup>
// IMPORTS
import {onMounted, ref} from "vue";

import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const optionSetsStore = useOptionSetsStore();
const { getTeams } = useAdminTeams();
const { getRoles } = useAdminRoles();
const { getUsers } = useAdminUsers();

// INJECT

// PROPS, EMITS
const props = defineProps({
  message: {
    type: Object,
    default: () => ({}),
  },
});

// REFS
const loading = ref(true);

const teams = ref(null);
const roles = ref(null);
const users = ref(null);

const selectedTeams = ref([]);
const selectedRoles = ref([]);
const selectedUsers = ref([]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  let activeStateId = await optionSetsStore.getId("state", "active");

  let params = {
    per_page: 999999999,
    state: activeStateId,
  };

  teams.value = await getTeams(params);
  roles.value = await getRoles(params);
  users.value = await getUsers(params);

  loading.value = false;
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  await loadLazyData();

  if (props.message) {
    selectedTeams.value = props.message.teams_id;
    selectedRoles.value = props.message.roles_id;
    selectedUsers.value = props.message.users_id;
  }
});
</script>

<style scoped></style>
