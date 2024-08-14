<template>
  <div v-if="team" class="wm-detail-form-container flex flex-auto flex-column overflow-auto">
    <div class="asset-data flex flex-column gap-5 mb-5">
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="flex-1 card-container top-info-card">
          <Card>
            <template #title> {{ $t("team.general-info") }} </template>
            <template #content>
              <div class="flex flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="id"
                    type="info"
                    :highlighted="true"
                    :label="$t('id') + ':'"
                    label-size="large"
                    required
                    :value="team.id"
                  />

                  <WMInput
                    name="name"
                    :required="true"
                    type="input-text"
                    :label="$t('team-name') + ':'"
                    :value="team.name"
                    size="md"
                  />

                  <WMInputDropdownManager :selected-manager="team.manager" size="md" />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>
    <div class="flex flex-row justify-content-end gap-5">
      <WMLinkedAdminUserTable
        :columns="linkedUsersTableColumns"
        :url-params="[{ key: 'teams', value: [team.id] }]"
        selectable
        preview
        :add-users-function="linkUsers"
        :remove-users-function="handleRemoveUsers"
      >
        <template #title> {{ $t("team.users-in-team") }} </template>
      </WMLinkedAdminUserTable>
    </div>

    <div class="flex flex-column gap-5">
      <WMPermissionsConfig
        v-if="Object.keys(permissions).length > 0"
        :permissions="permissions"
        @permissions-changed="handlePermissionsChanged"
      />
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const route = useRoute();
const { updateTeam, parseTeam, addUsers, removeUsers } = useAdminTeams();
const { getPermissions } = useAdminPermissions();

const formUtilsStore = useFormUtilsStore();
const utilsStore = useUtilsStore();
const toast = useToast();
const { t } = useI18n();

// INJECT

// PROPS, EMITS
const props = defineProps({
  team: {
    type: Object,
    required: true,
  },
  formKey: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["teamUpdated"]);

// REFS
const permissions = ref([]);

const linkedUsersTableColumns = [
  {
    name: "id",
    type: "link",
    field: "link_detail",
    header: "id",
    routeName: "adminUserDetail",
  },
  {
    name: "username",
    type: "text",
    field: "username",
    header: "employee.username",
  },
  {
    name: "manager",
    type: "text",
    field: "manager_fullname",
    header: "manager",
  },
  {
    name: "phone",
    type: "text",
    field: "phone",
    header: "mobilephone",
  },
  {
    name: "email",
    type: "text",
    field: "email",
    header: "email",
  },
  {
    name: "active",
    type: "state",
    field: "state",
    header: "state.state",
    width: "100px",
    class: "p-0 filled-td",
  },
  {
    name: "roles",
    type: "chips",
    field: "roles",
    header: "roles",
  },
  {
    name: "teams",
    type: "chips",
    field: "teams",
    header: "teams",
  },
];

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleSubmit, meta, resetForm } = useForm({
  validationSchema: formUtilsStore.getTeamUpdateFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  updateTeam(route.params.id, parseTeam(values))
    .then(() => {
      toast.success({ message: "User updated successfully" });
      resetForm({ values: values });
      emit("teamUpdated");
    })
    .catch((error) => {
      console.error(error);
      toast.error("Error updating team");
    });
});

formUtilsStore.formEntity = "team";
utilsStore.entity = "team";

const linkUsers = async (userIds) => {
  await addUsers(route.params.id, { employees: userIds });

  toast.info({
    title: t("team.toast-linked-user-message"),
    life: 5000,
    group: "br",
  });
};

const handleRemoveUsers = async (userIds) => {
  await removeUsers(route.params.id, { employees: userIds });

  toast.info({
    title: t("team.toast-unlinked-user-message"),
    life: 5000,
    group: "br",
  });
};

const loadPermissions = async () => {
  getPermissions("team", route.params.id).then((response) => {
    permissions.value = response.data;
  });
};

loadPermissions();

const handlePermissionsChanged = () => {
  meta.value.dirty = true;
  formUtilsStore.setFormMetas(meta.value, props.formKey); // forces save button to be enabled
};

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
</script>

<style scoped></style>
