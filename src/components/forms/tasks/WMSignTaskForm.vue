<template>
  <div class="flex flex-auto flex-column gap-3 pt-5 align-items-start">
    <div class="wm-form-column">
      <WMInput
        name="signature_status"
        type="input-select"
        :highlighted="true"
        label="Signature status:"
        :options="signatureStatusOptions"
        :required="true"
        option-set
        width="200"
      />
    </div>
    <div class="wm-form-column w-7">
      <WMInput
        name="notes"
        :required="true"
        type="input-text"
        class="w-full"
        :label="$t('notes') + ':'"
      />
    </div>
    <div class="wm-form-column w-7">
      <span class="wm-form-label">
        Signature: <span class="text-red-500"> *</span>
      </span>
      <Vue3Signature
        ref="signature1"
        :sig-option="state.option"
        :h="'200px'"
        :disabled="state.disabled"
        class="sign-area my-3"
      />
      <Button
        label="Clear signature"
        text
        severity="secondary"
        class="my-2"
        @click="clear"
      />
    </div>
  </div>
  <Divider />
  <Button label="Sign task" autofocus class="mb-5" @click="onSave" />
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { onMounted, reactive, ref } from "vue";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const toast = useToast();
const { signTask } = useTasks();
const formUtilsStore = useFormUtilsStore();
const optionSetsStore = useOptionSetsStore();

// PROPS, EMITS
const props = defineProps({
  signatureId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["taskSigned"]);

// REFS
const signatureStatusOptions = ref();

const state = reactive({
  count: 0,
  option: {
    penColor: "rgb(0, 0, 0)",
    backgroundColor: "rgb(255,255,255)",
  },
  disabled: false,
});

const signature1 = ref(null);

// COMPUTED
// COMPONENT METHODS AND LOGIC
const { handleSubmit } = useForm({
  validationSchema: formUtilsStore.getSignTaskFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  if (signature1.value.isEmpty()) {
    toast.error("Signature is required");
    return;
  }

  const signature = signature1.value.save();
  const cleanBase64Signature = signature.replace("data:image/png;base64,", "");

  const data = {
    signature_status: values.signature_status.id,
    remarks: values.notes,
    signature: cleanBase64Signature,
  };

  signTask(props.signatureId, data)
    .then(() => {
      emit("taskSigned");
      toast.success({ message: "Task signed successfully" });
    })
    .catch((error) => {
      console.error(error);
      toast.error("Error signing task");
    });
});

const clear = () => {
  signature1.value.clear();
};

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  optionSetsStore
    .getOptionSetValuesFromApi("status_round_of_signatures")
    .then((data) => {
      signatureStatusOptions.value = data;
    });
});
</script>

<style scoped>
.sign-area {
  margin: 0 auto;
  border-radius: 8px;
  border: 1px solid var(--gray-500);
  overflow: hidden;
}
</style>
