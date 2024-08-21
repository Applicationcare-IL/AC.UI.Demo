<template>
  <div class="flex flex-column gap-3">

    <WMInputSearch
        v-if="teams"
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
import {ref} from "vue";

import useAdminRoles from "@/composables/useAdminRoles";
import useAdminTeams from "@/composables/useAdminTeams";
import useAdminUsers from "@/composables/useAdminUsers";
import {useOptionSetsStore} from "@/stores/optionSets";

// DEPENDENCIES
const optionSetsStore = useOptionSetsStore();
const {getTeams} = useAdminTeams();
const {getRoles} = useAdminRoles();
const {getUsers} = useAdminUsers()

// INJECT

// PROPS, EMITS

// REFS
const teams = ref(null);
const roles = ref(null);
const users = ref(null);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  let activeStateId = await optionSetsStore.getId("state", "active");

  let params = {
    per_page: 999999999,
    state: activeStateId
  };

  teams.value = await getTeams(params);
  roles.value = await getRoles(params);
  users.value = await getUsers(params);

}

loadLazyData();

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
