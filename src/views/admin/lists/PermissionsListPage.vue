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
        <Skeleton
          v-if="!users.data && !teams.data && !roles.data"
          height="2rem"
          width="20rem"
          class="mb-2"
        />

        <div v-else class="flex gap-2 mb-2">
          <WMSelectableButtonGroup
            :options="options"
            @update:selected-option="handleSelectedOption"
          />
        </div>

        <WMInputSearch
          v-if="selectedOption?.value === 'user' && users.data"
          name="users"
          :placeholder="$t('employee.select-employee')"
          size="lg"
          :options="users.data"
          @update:model-value="loadPermissions('employee', $event)"
        />

        <WMInputSearch
          v-if="selectedOption?.value === 'team' && teams.data"
          name="teams"
          :placeholder="$t('team.select-team')"
          size="lg"
          :options="teams.data"
          @update:model-value="loadPermissions('team', $event)"
        />

        <WMInputSearch
          v-if="selectedOption?.value === 'role' && roles.data"
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
      <WMPermissionsConfig :permissions="permissions">
        <template v-if="selectedOption?.value === 'user'" #reset-entity-permissions>
          <WMResetPermissionsButton
            :permissions="permissions"
            type="entity"
            :entity-id="selectedEntityId"
            @permissions-changed="loadPermissions"
          />
        </template>

        <template v-if="selectedOption?.value === 'user'" #reset-general-permissions>
          <WMResetPermissionsButton
            :permissions="permissions"
            type="general"
            :entity-id="selectedEntityId"
            @permissions-changed="loadPermissions"
          />
        </template>
      </WMPermissionsConfig>
    </div>
    <div v-else class="flex flex-row gap-5 flex-wrap flex-column">
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

import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const toast = useToast();

const { t } = useI18n();

const { getUsers } = useAdminUsers();
const { getTeams } = useAdminTeams();
const { getRoles } = useAdminRoles();

const { getPermissions, updatePermissions } = useAdminPermissions();

const optionSetsStore = useOptionSetsStore();

// INJECT

// PROPS, EMITS

// REFS
const selectedOption = ref(null);
const selectedEntity = ref(null);
const selectedEntityId = ref(null);

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
  title: "Permissions Center",
});

const handleSelectedOption = (option) => {
  loading.value = true;
  isSaveDisabled.value = true;
  selectedOption.value = option;
};

const loadPermissions = async (entityType, entity) => {
  loading.value = true;
  permissions.value = [];
  selectedEntity.value = entityType;
  selectedEntityId.value = entity.id;

  getPermissions(entityType, entity.id).then((response) => {
    permissions.value = response.data;
    loading.value = false;
  });
};

const savePermissions = async () => {
  try {
    isSaved.value = await updatePermissions(
      selectedEntity.value,
      selectedEntityId.value,
      permissions.value
    );

    isSaveDisabled.value = true;

    toast.success({ message: t("permissions.permissions-updated-successfully") });
  } catch (error) {
    toast.error(t("permissions.permissions-updated-error"));
  }
};

// PROVIDE, EXPOSE

// WATCHERS
watch(
  permissions,
  () => {
    isSaved.value = false;
    isSaveDisabled.value = false;
  },
  {
    deep: true,
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  let activeStateId = await optionSetsStore.getId("state", "active");

  let filters = {
    state: activeStateId,
    per_page: 9999999,
  };

  users.value = await getUsers(filters);
  teams.value = await getTeams(filters);
  roles.value = await getRoles(filters);
});
</script>

<style scoped lang="scss"></style>
