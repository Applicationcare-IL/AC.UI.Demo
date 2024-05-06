<template>
  <Dialog
    v-model:visible="modelValue"
    modal
    :header="$t('task.payment-request-task-title')"
    :style="{ minWidth: '30vw' }"
  >
    task
    <pre>    {{ task }}</pre>

    <div class="flex justify-content-end gap-2">
      <Button
        type="button"
        :label="$t('buttons.cancel')"
        severity="secondary"
        @click="modelValue = false"
      />
      <Button
        type="button"
        :label="$t('task.create-payment-request')"
        @click="handleCreatePaymentRequestTask"
      />
    </div>
  </Dialog>
</template>

<script setup>
const modelValue = defineModel();

const emit = defineEmits("requestPaymentTaskCreated");

defineProps({
  task: Object,
});

const handleCreatePaymentRequestTask = () => {
  console.log("Create payment request task");
  modelValue.value = false;
  emit("requestPaymentTaskCreated", 1);
};
</script>
