<template>
  <!--  <pre>{{ values }}</pre>-->
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="task-data flex flex-auto flex-column gap-5 mb-5">
      <h1 v-if="!isSidebar" class="h1 mb-0">{{ $t("new", ["message.message"]) }}</h1>
      <h2 class="h2 my-0">{{ $t("general-details") }}</h2>

      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <WMInput
            name="topic"
            :required="true"
            type="input-text"
            :label="$t('message.header') + ':'"
          />
        </div>
      </div>

      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <WMInput
            name="important"
            type="input-select-button"
            :highlighted="true"
            :label="$t('message.rating') + ':'"
            :options="normalImportantOptions"
            :value="normalImportantOptions[0]"
          />
        </div>
      </div>

      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <WMInput type="date" :label="$t('start-date') + ':'" name="start_date" required />

          <WMInput
            v-if="values.start_date"
            type="date"
            :label="$t('end-date') + ':'"
            name="end_date"
            :min-date="values.start_date"
            required
          />
        </div>
      </div>

      <Divider />

      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <WMInput
            :label="$t('message.content')"
            label-size="large"
            type="text-area"
            name="message"
            size="full"
            required
          />
        </div>
      </div>

      <Divider />

      <h2 class="h2 my-0">{{ $t("message.target") }} <span class="text-red-500"> *</span></h2>

      <WMMessageTarget />

      <WMFormButtons v-if="isSidebar" @save-form="onSubmit()" @cancel-form="onCancel()" />
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import {inject, watch} from "vue";
import { useI18n } from "vue-i18n";

import { useFormUtilsStore } from "@/stores/formUtils";

// DEPENDENCIES
const formUtilsStore = useFormUtilsStore();
const { t } = useI18n();
const { createMessage, parseMessage } = useAdminMessages();

const toast = useToast();
const dialog = useDialog();

// INJECT
const closeSidebar = inject("closeSidebar");
const isFormDirty = inject("isFormDirty");

// PROPS, EMITS
const props = defineProps({
  isSidebar: Boolean,
});

const emit = defineEmits(["newMessageCreated"]);

// REFS
const normalImportantOptions = [
  { value: "false", name: t("message.normal") },
  { value: "true", name: t("message.important") },
];

// COMPUTED

// COMPONENT METHODS AND LOGIC
const {handleSubmit, values, resetForm, meta} = useForm({
  validationSchema: formUtilsStore.getMessageNewFormValidationSchema,
});

const onSubmit = handleSubmit(async (values) => {
  try {
    let data = await createMessage(parseMessage(values));

    emit("newMessageCreated");
    dialog.confirmNewAdminMessage({id: data.data.id, emit});

    resetForm();

    if (props.isSidebar) {
      isFormDirty.value = false;
      closeSidebar();
    }

    toast.success({title: "Message created", message: "message created successfully"});
  } catch (error) {
    console.log(error);
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
