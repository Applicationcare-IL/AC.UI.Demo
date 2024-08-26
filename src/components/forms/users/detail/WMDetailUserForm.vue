<template>
  <!-- <pre>{{ user }}</pre> -->
  <div v-if="user" class="wm-detail-form-container flex flex-auto flex-column overflow-auto">
    <div class="asset-data flex flex-auto flex-column gap-5 mb-5">
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="flex-1 card-container">
          <Card class="p-card--first-top-card">
            <template #title> {{ $t("employee.general-info") }} </template>
            <template #content>
              <div class="flex flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="id"
                    type="info"
                    :highlighted="true"
                    :label="$t('id') + ':'"
                    :value="user.id"
                  />
                </div>
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="name"
                    type="input-text"
                    :highlighted="true"
                    :label="$t('first-name') + ':'"
                    :value="user.name"
                    required
                  />
                  <WMInput
                    name="surname"
                    type="input-text"
                    :highlighted="true"
                    :label="$t('last-name') + ':'"
                    :value="user.surname"
                    required
                  />
                </div>
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="phone"
                    type="input-text"
                    :highlighted="true"
                    :label="$t('mobilephone') + ':'"
                    :value="user.phone"
                    required
                  />
                  <WMInput
                    name="email"
                    type="input-text"
                    :highlighted="true"
                    :label="$t('email') + ':'"
                    :value="user.email"
                    size="md"
                    required
                  />
                </div>
                <WMInputDropdownManager :selected-manager="user.manager" />
              </div>
            </template>
          </Card>
        </div>
        <div class="card-container" style="flex: 2">
          <Card>
            <template #title> {{ $t("employee.teams-and-roles") }} </template>
            <template #content>
              <div class="flex flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInputSearch
                    v-if="teams && !loadingFields"
                    name="teams"
                    :label="$t('teams') + ':'"
                    :placeholder="$t('select-team')"
                    :multiple="true"
                    size="full"
                    :options="teams.data"
                    :model-value="selectedTeams"
                    :highlighted="true"
                  />
                  <Skeleton v-if="loadingFields" height="74px"></Skeleton>
                </div>
                <div class="wm-form-row gap-5">
                  <WMInputDropdownDefaultTeam
                    v-if="values.teams"
                    :teams="values.teams"
                    :selected-team="user.team"
                    size="full"
                  />
                </div>
                <div class="wm-form-row gap-5">
                  <WMInputSearch
                    v-if="roles"
                    name="roles"
                    :label="$t('roles') + ':'"
                    :placeholder="$t('select-role')"
                    :multiple="true"
                    size="full"
                    :options="roles.data"
                    :model-value="selectedRoles"
                    :highlighted="true"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
      <div>
        <WMPermissionsConfig
          v-if="Object.keys(permissions).length > 0"
          :permissions="permissions"
          @permissions-changed="handlePermissionsChanged"
        >
          <template #reset-entity-permissions>
            <WMResetPermissionsButton
              :permissions="permissions"
              type="entity"
              :entity-id="user.id"
              @permissions-changed="loadPermissions"
            />
          </template>

          <template #reset-general-permissions>
            <WMResetPermissionsButton
              :permissions="permissions"
              type="general"
              :entity-id="user.id"
              @permissions-changed="loadPermissions"
            />
          </template>
        </WMPermissionsConfig>
      </div>
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const route = useRoute();
const { updateUser, parseUpdateUser } = useAdminUsers();
const { getTeams } = useAdminTeams();
const { getRoles } = useAdminRoles();
const { getPermissions, updatePermissions } = useAdminPermissions();

const optionSetsStore = useOptionSetsStore();
const formUtilsStore = useFormUtilsStore();
const toast = useToast();

// INJECT

// PROPS, EMITS
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  formKey: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["userUpdated"]);

// REFS
const teams = ref([]);
const roles = ref([]);
const permissions = ref([]);

const selectedTeams = ref([]);
const selectedRoles = ref([]);
const loadingFields = ref(true);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleSubmit, meta, resetForm, values } = useForm({
  validationSchema: formUtilsStore.getUserUpdateFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  updateUser(route.params.id, parseUpdateUser(values))
    .then(async () => {
      return await updatePermissions("employee", route.params.id, permissions.value);
    })
    .then(() => {
      toast.success({ message: "User updated successfully" });
      resetForm({ values: values });
      emit("userUpdated");
    })
    .catch((error) => {
      console.error(error);
      toast.error("Error updating user");
    });
});

const initializeFields = async (user) => {
  let activeStateId = await optionSetsStore.getId("state", "active");

  let filters = {
    state: activeStateId,
    per_page: 9999,
  };

  teams.value = await getTeams(filters);
  roles.value = await getRoles(filters);

  selectedTeams.value = teams.value.data.filter((item) => user.teams.find((x) => x.id == item.id));
  selectedRoles.value = roles.value.data.filter((item) => user.roles.find((x) => x.id == item.id));

  loadingFields.value = false;
};

const loadPermissions = async () => {
  getPermissions("employee", route.params.id).then((response) => {
    permissions.value = response.data;
    loadingFields.value = false;
  });
};

const handlePermissionsChanged = () => {
  meta.value.dirty = true;
  formUtilsStore.setFormMetas(meta.value, props.formKey); // forces save button to be enabled
};

formUtilsStore.formEntity = "employee";

// PROVIDE, EXPOSE
defineExpose({
  onSave,
});

// WATCHERS
watch(
  () => meta.value,
  (value) => {
    if (value.touched) {
      formUtilsStore.formMeta = value;
      formUtilsStore.setFormMetas(value, props.formKey);
    }
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  initializeFields(props.user);
  loadPermissions();
});
</script>
