<template>
  <WMButton name="edit" icon="edit" @click="openDialog" />

  <Dialog
    v-model:visible="isOpen"
    modal
    header="Sign Task Form"
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
  >
    <div class="flex flex-auto flex-row gap-6">
      <div class="wm-form-column gap-5">
        <Vue3Signature
          ref="signature1"
          :sig-option="state.option"
          :w="'400px'"
          :h="'200px'"
          :disabled="state.disabled"
          class="sign-area my-3"
        ></Vue3Signature>
        <Button
          label="Clear"
          text
          severity="secondary"
          class="my-2"
          @click="clear"
        />
      </div>
    </div>
    <template #footer>
      <Button label="Sign task" icon="pi pi-check" autofocus @click="save" />
    </template>
  </Dialog>
</template>

<script setup>
import { reactive, ref } from "vue";

import { useLayout } from "@/layout/composables/layout";

defineProps({
  entity: {
    type: String,
    default: "",
  },
});

const { layoutConfig } = useLayout();

const isOpen = ref(false);

const openDialog = () => {
  isOpen.value = true;
};

// SIGNATURE
const state = reactive({
  count: 0,
  option: {
    penColor: "rgb(0, 0, 0)",
    backgroundColor: "rgb(255,255,255)",
  },
  disabled: false,
});

const signature1 = ref(null);

const save = (t) => {
  console.log(signature1.value.save(t));
};

const clear = () => {
  signature1.value.clear();
};
</script>

<style scoped>
.sign-area {
  margin: 0 auto;
  border-radius: 8px;
  border: 1px solid var(--gray-500);
  overflow: hidden;
}
</style>
