<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="task-data flex flex-auto flex-column gap-5 mb-5">
      <h1 v-if="!isSidebar" class="h1 mb-0">{{ $t("new", ["role.role"]) }}</h1>
      <h2 class="h2 my-0">{{ $t("general-details") }}</h2>

      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <WMInput
              name="role-name"
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

import WMInput from "@/components/forms/WMInput.vue";
import {useForm} from "vee-validate";
import {inject} from "vue";
import {useFormUtilsStore} from "@/stores/formUtils";

const formUtilsStore = useFormUtilsStore();

const closeSidebar = inject("closeSidebar");
const { can } = usePermissions();


defineProps({
  isSidebar: Boolean,
});

const { handleSubmit } = useForm({
  validationSchema: formUtilsStore.getRoleNewFormValidationSchema,
});

const onSubmit = handleSubmit((values) => {
  console.log("values", values);
});

const onCancel = () => {
  closeSidebar();
};

// PROVIDE, EXPOSE
defineExpose({
  onSubmit,
  onCancel,
});

</script>