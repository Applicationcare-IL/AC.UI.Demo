<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="task-data flex flex-auto flex-column gap-5 mb-5">
      <h1 v-if="!isSidebar" class="h1 mb-0">{{ $t("new", ["role.role"]) }}</h1>
      <h2 class="h2 my-0">{{ $t("general-details") }}</h2>

      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <WMInput name="name" :required="true" type="input-text" :label="$t('role-name') + ':'" />
        </div>
      </div>

      <Divider />

      <WMAdminUserSelectorTable />

      <WMFormButtons v-if="isSidebar" @save-form="onSubmit()" @cancel-form="onCancel()" />
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { inject, watch } from "vue";

import { useFormUtilsStore } from "@/stores/formUtils";

// DEPENDENCIES
const { createRole, parseRole, addUsers } = useAdminRoles();
const formUtilsStore = useFormUtilsStore();

const closeSidebar = inject("closeSidebar");
const { can } = usePermissions();
const dialog = useDialog();
const toast = useToast();

// INJECT
const isFormDirty = inject("isFormDirty");

// PROPS, EMITS
const props = defineProps({
  isSidebar: Boolean,
});

const emit = defineEmits(["newRoleCreated"]);

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleSubmit, meta, resetForm } = useForm({
  validationSchema: formUtilsStore.getRoleNewFormValidationSchema,
});

const onSubmit = handleSubmit(async (values) => {
  try {
    let data = await createRole(parseRole(values));

    if (values.userList.length > 0) {
      let userIds = values.userList.map((user) => user.id);
      await addUsers(data.data.id, { users: userIds });
    }

    emit("newRoleCreated");
    dialog.confirmNewAdminRole({ id: data.data.id, emit });

    resetForm();

    if (props.isSidebar) {
      isFormDirty.value = false;
      closeSidebar();
    }

    toast.success({ title: "Role created", message: "Role created successfully" });
  } catch (error) {
    console.error(error);
  }
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

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
