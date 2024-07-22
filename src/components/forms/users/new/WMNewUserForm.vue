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
      <Divider class="my-5" layout="horizontal" style="height: 4px" />

      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <label for="api" class="wm-form-label"> Can use API </label>
          <Checkbox v-model="api" input-id="api" name="" value="" />
        </div>
      </div>

      <WMFormButtons v-if="isSidebar" @save-form="onSubmit()" @cancel-form="onCancel()" />
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { inject } from "vue";

import { useFormUtilsStore } from "@/stores/formUtils";

// DEPENDENCIES
const formUtilsStore = useFormUtilsStore();
const { createUser, parseUser } = useAdminUsers();
const toast = useToast();

// INJECT
const closeSidebar = inject("closeSidebar");

// PROPS, EMITS
defineProps({
  isSidebar: Boolean,
});

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleSubmit } = useForm({
  validationSchema: formUtilsStore.getUserNewFormValidationSchema,
});

const onSubmit = handleSubmit((values) => {
  createUser(parseUser(values))
    .then((data) => {
      console.log("data", data);
      // emit("newTaskCreated");
      // dialog.confirmNewTask({ id: data.data.id, emit });

      // resetForm();
      // isFormDirty.value = false;

      closeSidebar();

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

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped lang="scss"></style>
