<template>
<!--  <pre>{{ message }}</pre>-->
<!--  <pre>{{ values }}</pre>-->
  <div v-if="message" class="wm-detail-form-container flex flex-auto flex-column overflow-auto">
    <div class="asset-data flex flex-auto flex-column gap-5 mb-5">

      <div class="flex flex-row gap-5 flex-wrap">
        <div class="flex-1 card-container top-info-card">
          <Card>
            <template #title> {{ $t("message.detail") }} </template>
            <template #content>
              <div class="flex flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                      name="id"
                      type="info"
                      :highlighted="true"
                      :label="$t('id') + ':'"
                      :value="message.id"
                  />
                  <WMInput
                      name="topic"
                      type="input-text"
                      :highlighted="true"
                      :label="$t('message.header') + ':'"
                      :value="message.topic"
                      size="md"
                      required
                  />
                </div>
                <div class="wm-form-row gap-5">
                  <WMInput
                      v-model="start_date"
                      type="date"
                      :label="$t('start-date') + ':'"
                      name="start_date"
                      :value="message.start_date"
                      required
                  />

                  <WMInput
                      type="date"
                      :label="$t('end-date') + ':'"
                      name="end_date"
                      :value="message.end_date"
                      :min-date="start_date"
                  />

                  <WMInput
                      name="important"
                      type="input-select-button"
                      :highlighted="true"
                      :label="$t('message.rating') + ':'"
                      :options="normalImportantOptions"
                      :value="normalImportantOptions[message.important]"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>

      <div class="flex flex-row gap-5 flex-wrap">
        <div class="flex-1 card-container top-info-card">
          <Card>
            <template #title> {{ $t("message.content") }} </template>
            <template #content>
              <WMInput
                  name="message"
                  type="text-area"
                  :label="$t('message.content')"
                  :value="message.message"
                  size="full"
                  highlighted
              />
            </template>
          </Card>
        </div>
      </div>

      <div class="flex flex-row gap-5 flex-wrap">
        <div class="flex-1 card-container top-info-card">
          <Card>
            <template #title> {{ $t('message.target') }}</template>
            <template #content>
              <WMMessageTarget :message="message"/>
            </template>
          </Card>
        </div>
      </div>

      <div class="flex flex-row gap-5 flex-wrap">
        <div class="flex-1 card-container top-info-card">
          <Card>
            <template #title> {{ $t('logs') }}</template>
            <template #content>

            </template>
          </Card>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

import useAdminMessages from "@/composables/useAdminMessages";
import { useFormUtilsStore } from "@/stores/formUtils";
import {useI18n} from "vue-i18n";

// DEPENDENCIES
const route = useRoute();
const { updateMessage, parseMessage } = useAdminMessages();

const formUtilsStore = useFormUtilsStore();
const toast = useToast();
const { t } = useI18n();

// INJECT

// PROPS, EMITS
const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
  formKey: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["messageUpdated"]);

// REFS
const start_date = ref();

const normalImportantOptions = [
  { value: "false", name: t("message.normal") },
  { value: "true", name: t("message.important") },
];

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleSubmit, meta, resetForm, values } = useForm({
  validationSchema: formUtilsStore.getMessageUpdateFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  updateMessage(route.params.id, parseMessage(values))
      .then(() => {
        toast.success({ message: "Message updated successfully" });
        resetForm({ values: values });
        emit("messageUpdated");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error updating message");
      });
});

formUtilsStore.formEntity = "message";

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