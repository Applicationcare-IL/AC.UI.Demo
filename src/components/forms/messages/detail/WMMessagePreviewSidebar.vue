<template>
  <Sidebar
      v-if="props.message"
      v-model:visible="visible"
      class="details-sidebar w-4"
      :show-close-icon="false"
      :class="''"
      @update:model-value="updateModelValue"
  >
    <div class="flex flex-auto flex-column overflow-auto w-full px-2">
      <div class="flex justify-content-between">
        <h2 class="h2">{{ props.message.topic }}</h2>
        <router-link
            :to="{
            name: 'adminMessageDetail',
            params: { id: props.message.id },
          }"
            class="p-2"
        >
          <Button>Edit</Button>
        </router-link>
      </div>
      <Divider />

      <div class="task-data flex flex-auto flex-column gap-5 mb-5">
        <div class="wm-form-row align-items-end gap-5">
          <div class="wm-form-row gap-5">
            <WMInput
                name="id"
                type="info"
                :highlighted="true"
                :label="$t('id') + ':'"
                :value="props.message.id"
            />
            <WMInput
                name="state"
                type="info"
                :highlighted="true"
                :label="$t('state') + ':'"
                :value="props.message.state.value"
                :class="statusClass(props.message.state.value)"
            />
          </div>
        </div>
        <div class="wm-form-row align-items-end gap-5">
          <div class="wm-form-row gap-5">
              <WMInput
                  name="topic"
                  type="info"
                  :highlighted="true"
                  :label="$t('message.header') + ':'"
                  :value="props.message.topic"
              />
          </div>
        </div>
        <div class="wm-form-row align-items-end gap-5">
          <div class="wm-form-row gap-5">
            <WMInput
                name="topic"
                type="info"
                :highlighted="true"
                :label="$t('message.header') + ':'"
                :value="props.message.topic"
            />
          </div>
        </div>

        </div>
      </div>


  </Sidebar>
</template>

<script setup>
// IMPORTS
import  { ref } from 'vue';

// DEPENDENCIES
const { getStatusConditionalStyle } = useListUtils();

// INJECT

// PROPS, EMITS
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  message: {
    type: Object,
    default: () => {},
  },
});

// REFS
const visible = ref(false);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const statusClass = (data) => {
  return getStatusConditionalStyle(data);
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
