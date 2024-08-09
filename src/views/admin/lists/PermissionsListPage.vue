<template>
  <div class="wm-detail-form-container flex flex-auto flex-column overflow-auto">
    <div class="flex flex-column gap-5 mb-5">
      <div class="flex flex-row flex-wrap flex-column">
        <p class="h4">Permissions for:</p>
        <div class="flex gap-2 mb-2">
          <WMSelectableButton
            v-model="isUserSelected"
            :label="$t('user')"
            no-icon
            @click="
              unSelectOptions();
              isUserSelected = true;
            "
          />
          <WMSelectableButton
            v-model="isTeamSelected"
            :label="$t('team.team')"
            no-icon
            @click="
              unSelectOptions();
              isTeamSelected = true;
            "
          />
          <WMSelectableButton
            v-model="isRoleSelected"
            :label="$t('role.role')"
            no-icon
            @click="
              unSelectOptions();
              isRoleSelected = true;
            "
          />
        </div>

        <WMInputSearch
          v-if="isUserSelected && users"
          name="users"
          :placeholder="$t('employee.select-employee')"
          size="lg"
          :options="users.data"
          @update:model-value="loadPermissions('employee', $event)"
        />

        <WMInputSearch
          v-if="isTeamSelected && teams"
          name="teams"
          :placeholder="$t('team.select-team')"
          size="lg"
          :options="teams.data"
          @update:model-value="loadPermissions('team', $event)"
        />

        <WMInputSearch
          v-if="isRoleSelected && roles"
          name="roles"
          :placeholder="$t('role.select-role')"
          size="lg"
          :options="roles.data"
          @update:model-value="loadPermissions('role', $event)"
        />
      </div>
    </div>
    <Divider />
    <div class="flex flex-column gap-5 mb-5">
      <div class="flex flex-row flex-wrap flex-column">
        <p class="h2">Entity permissions</p>

        <WMEntityPermissionsTable :permissions="entityPermissions" />
      </div>
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { onMounted, ref } from "vue";

// DEPENDENCIES
const { getUsers } = useAdminUsers();
const { getTeams } = useAdminTeams();
const { getRoles } = useAdminRoles();

const { getPermissions } = useAdminPermissions();

// INJECT

// PROPS, EMITS

// REFS
const isUserSelected = ref(true);
const isTeamSelected = ref(false);
const isRoleSelected = ref(false);

const users = ref([]);
const teams = ref([]);
const roles = ref([]);

const entityPermissions = ref([]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Permissions",
});

const unSelectOptions = () => {
  isUserSelected.value = false;
  isTeamSelected.value = false;
  isRoleSelected.value = false;
};

const loadPermissions = async (entityType, entity) => {
  getPermissions(entityType, entity.id).then((response) => {
    const keysToFilter = ["permission_service_area", "global", "document"];

    // filter the permissions to remove the keys in the keysToFilter array
    const filteredPermissions = Object.keys(response.data).reduce((acc, key) => {
      if (!keysToFilter.includes(key)) {
        acc[key] = response.data[key];
      }
      return acc;
    }, {});

    entityPermissions.value = filteredPermissions;
  });
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  users.value = await getUsers();
  teams.value = await getTeams();
  roles.value = await getRoles();
});
</script>

<style scoped lang="scss"></style>
