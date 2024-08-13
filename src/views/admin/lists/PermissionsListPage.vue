<template>
  <div class="wm-subheader shadow-1 flex-none">
    <div class="flex flex-column">
      <div class="flex flex-row justify-content-between align-items-center">
        <div class="flex flex-row align-items-center gap-4">
          <h1 class="h1 mb-0">{{ $t("permissions.permissions-center") }}</h1>
        </div>
      </div>
      <Divider />
      <div class="flex flex-row justify-content-between flex-wrap row-gap-4">
        <WMSaveButton :is-saved="isSaved" :is-disabled="isSaveDisabled" @click="savePermissions" />
      </div>
    </div>
  </div>

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
    <div v-if="!loading" class="flex flex-column gap-5 mb-5">
      <div class="flex flex-row flex-wrap flex-column">
        <p class="h2">Entity permissions</p>

        <WMEntityPermissionsTable :permissions="permissions.entities" />
      </div>
      <div class="flex flex-row flex-wrap flex-column">
        <p class="h2">General permissions</p>
        <!-- <pre>{{ permissions }}</pre> -->
        <div class="flex gap-5">
          <div class="flex flex-column gap-5 flex-1">
            <WMPermissionSection title="Dashboard">
              <template #custom-content> TO-DO </template>
            </WMPermissionSection>
            <WMPermissionSection title="Admin permissions" :permissions="permissions.admin" />
            <WMPermissionSection title="Actions" :permissions="permissions.actions" clear-all />
          </div>
          <div class="flex flex-column gap-5 flex-1">
            <!-- <WMPermissionSection title="Admin permissions" :permissions="permissions.admin" />
            <WMPermissionSection title="Admin permissions" :permissions="permissions.admin" /> -->
          </div>
          <div class="flex flex-column gap-5 flex-1">
            <!-- <WMPermissionSection title="Admin permissions" :permissions="permissions.admin" />
            <WMPermissionSection title="Admin permissions" :permissions="permissions.admin" /> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { onMounted, ref, watch } from "vue";

// DEPENDENCIES
const toast = useToast();

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

const permissions = ref([]);

const loading = ref(true);

const isSaved = ref(false);
const isSaveDisabled = ref(true);

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
    permissions.value = response.data;
    loading.value = false;
  });
};

const savePermissions = async () => {
  isSaveDisabled.value = true;
  console.log("saving permissions", permissions.value);

  toast.success({ message: "Permissions updatedsuccessfully" });

  // isSaved.value = await savePermissions(permissions.value);
};

// PROVIDE, EXPOSE

// WATCHERS
watch(
  permissions,
  () => {
    isSaveDisabled.value = false;
  },
  {
    deep: true,
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  users.value = await getUsers();
  teams.value = await getTeams();
  roles.value = await getRoles();
});
</script>

<style scoped lang="scss"></style>
