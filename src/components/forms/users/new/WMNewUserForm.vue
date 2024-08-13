<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="task-data flex flex-auto flex-column gap-5 mb-5">
      <h1 v-if="!isSidebar" class="h1 mb-0">{{ $t("new", ["employee.employee"]) }}</h1>
      <h2 class="h2 my-0">{{ $t("general-details") }}</h2>

      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <WMInput name="name" :required="true" type="input-text" :label="$t('first-name') + ':'" />
          <WMInput
            name="surname"
            :required="true"
            type="input-text"
            :label="$t('last-name') + ':'"
          />
        </div>
      </div>
      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <WMInput
            name="email"
            :required="true"
            type="input-text"
            :label="$t('email') + ':'"
            size="md"
          />
          <WMInput name="phone" :required="true" type="input-text" :label="$t('Mobile') + ':'" />
        </div>
      </div>
      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <WMInputDropdownManager size="sm" />
        </div>
      </div>

      <Divider class="my-5" layout="horizontal" style="height: 4px" />

      <h2 class="h2 my-0">{{ $t("employee.teams-and-roles") }}</h2>

      <div class="flex flex-column gap-5">
        <div class="wm-form-row gap-5">
          <WMInputSearch
            v-if="teams"
            name="teams"
            :label="$t('teams') + ':'"
            :placeholder="$t('select-team')"
            :required="true"
            :multiple="true"
            size="full"
            :options="teams.data"
            :highlighted="true"
          />
        </div>
        <div class="wm-form-row gap-5">
          <WMInputDropdownDefaultTeam :teams="values.teams" size="full" />
        </div>
        <div class="wm-form-row gap-5">
          <WMInputSearch
            v-if="roles"
            name="roles"
            :label="$t('roles') + ':'"
            :placeholder="$t('select-role')"
            :required="true"
            :multiple="true"
            size="full"
            :options="roles.data"
            :highlighted="true"
          />
        </div>
      </div>

      <Divider class="my-5" layout="horizontal" style="height: 4px" />

      <WMFormButtons v-if="isSidebar" @save-form="onSubmit()" @cancel-form="onCancel()" />
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { inject, onMounted, ref, watch } from "vue";

import { useFormUtilsStore } from "@/stores/formUtils";

// DEPENDENCIES
const formUtilsStore = useFormUtilsStore();
const { createUser, parseUser } = useAdminUsers();
const { getTeams } = useAdminTeams();
const { getRoles } = useAdminRoles();

const toast = useToast();
const dialog = useDialog();

// INJECT
const closeSidebar = inject("closeSidebar");
const isFormDirty = inject("isFormDirty");

// PROPS, EMITS
const props = defineProps({
  isSidebar: Boolean,
});

const emit = defineEmits(["newUserCreated"]);

// REFS
const canUseApi = ref(false);
const teams = ref([]);
const roles = ref([]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleSubmit, meta, resetForm, values } = useForm({
  validationSchema: formUtilsStore.getUserNewFormValidationSchema,
});

const onSubmit = handleSubmit((values) => {
  const newUser = {
    ...values,
    can_use_api: canUseApi.value ? 1 : 0,
  };

  createUser(parseUser(newUser))
    .then((data) => {
      emit("newUserCreated");
      dialog.confirmNewAdminUser({ id: data.data.id, emit });

      resetForm();

      if (props.isSidebar) {
        isFormDirty.value = false;
        closeSidebar();
      }

      toast.success({ title: "User created", message: "User created successfully" });
    })
    .catch((error) => {
      console.error(error);
      toast.error("Error");
    });
});

const onCancel = () => {
  closeSidebar();
};

// PROVIDE, EXPOSE
defineExpose({
  onSubmit,
  onCancel,
});

// WATCHERS
watch(
  () => meta.value,
  (value) => {
    if (!isFormDirty) return;

    isFormDirty.value = value.dirty;
  }
);

onMounted(async () => {
  teams.value = await getTeams();
  roles.value = await getRoles();
});
// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped lang="scss"></style>
