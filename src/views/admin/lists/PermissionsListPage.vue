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
    <div class="flex flex-column gap-5">
      <div class="flex flex-row flex-wrap flex-column">
        <p class="h4">Permissions for:</p>
        <div class="flex gap-2 mb-2">
          <WMSelectableButtonGroup
            :options="options"
            @update:selected-option="handleSelectedOption"
          />
        </div>

        <WMInputSearch
          v-if="selectedOption?.value === 'user' && users"
          name="users"
          :placeholder="$t('employee.select-employee')"
          size="lg"
          :options="users.data"
          @update:model-value="loadPermissions('employee', $event)"
        />

        <WMInputSearch
          v-if="selectedOption?.value === 'team' && teams"
          name="teams"
          :placeholder="$t('team.select-team')"
          size="lg"
          :options="teams.data"
          @update:model-value="loadPermissions('team', $event)"
        />

        <WMInputSearch
          v-if="selectedOption?.value === 'role' && roles"
          name="roles"
          :placeholder="$t('role.select-role')"
          size="lg"
          :options="roles.data"
          @update:model-value="loadPermissions('role', $event)"
        />
      </div>
    </div>
    <Divider class="mb-5" />
    <div v-if="!loading" class="flex flex-column gap-5 mb-5">
      <WMPermissionsConfig :permissions="permissions" />
    </div>
    <div class="flex flex-row gap-5 flex-wrap flex-column">
      <div class="flex-1 card-container">
        <Card class="border-round-md h-20rem flex align-items-center justify-content-center">
          <template #content>
            <h4 class="h4">{{ $t("permissions.unselected-entity-message") }}</h4>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

// DEPENDENCIES
const toast = useToast();

const { t } = useI18n();

const { getUsers } = useAdminUsers();
const { getTeams } = useAdminTeams();
const { getRoles } = useAdminRoles();

const { getPermissions } = useAdminPermissions();

// INJECT

// PROPS, EMITS

// REFS
const selectedOption = ref(null);

const users = ref([]);
const teams = ref([]);
const roles = ref([]);

const permissions = ref([]);

const loading = ref(true);

const isSaved = ref(false);
const isSaveDisabled = ref(true);

const options = ref([
  {
    label: t("user"),
    value: "user",
  },
  {
    label: t("team.team"),
    value: "team",
  },
  {
    label: t("role.role"),
    value: "role",
  },
]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Permissions",
});

const handleSelectedOption = (option) => {
  loading.value = true;
  permissions.value = [];

  selectedOption.value = option;
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
