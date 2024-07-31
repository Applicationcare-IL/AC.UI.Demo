<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="task-data flex flex-auto flex-column gap-5 mb-5">
      <h1 v-if="!isSidebar" class="h1 mb-0">{{ $t("new", ["role.role"]) }}</h1>
      <h2 class="h2 my-0">{{ $t("general-details") }}</h2>

      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <WMInput
              name="name"
              :required="true"
              type="input-text"
              :label="$t('role-name') + ':'"
          />
        </div>
      </div>

      <WMFormButtons v-if="isSidebar" @save-form="onSubmit()" @cancel-form="onCancel()" />
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import {useForm} from "vee-validate";
import {inject} from "vue";

import WMInput from "@/components/forms/WMInput.vue";
import {useFormUtilsStore} from "@/stores/formUtils";
import useAdminRoles from "@/composables/useAdminRoles";

// DEPENDENCIES
const { createRole, parseRole } = useAdminRoles();
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

const onSubmit = handleSubmit((values) => {
  console.log(parseRole(values));
  createRole(parseRole(values))
      .then((data) => {
        emit("newRoleCreated");
        dialog.confirmNewAdminRole({ id: data.data.id, emit });

        resetForm();

        if (props.isSidebar) {
          isFormDirty.value = false;
          closeSidebar();
        }

        toast.success({ title: "Role created", message: "Role created successfully" });
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

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
