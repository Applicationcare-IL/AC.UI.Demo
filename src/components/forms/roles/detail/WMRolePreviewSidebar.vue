<template>
  <Sidebar
      v-if="props.role"
      v-model:visible="visible"
      class="details-sidebar w-6"
      :show-close-icon="false"
      :class="''"
      @update:model-value="updateModelValue"
  >
    <div class="wm-detail-form-container flex flex-auto flex-column overflow-auto">

      <div class="flex justify-content-between">
        <h2 class="h2">{{ props.role.name }}</h2>
        <router-link
            :to="{
          name: 'adminRoleDetail',
          params: { id: props.role.id },
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
                :value="props.role.id"
            />
            <WMInput
                name="state"
                type="info"
                :highlighted="true"
                :label="$t('state') + ':'"
                :value="props.role.state.value"
            />
          </div>
        </div>
        <Divider/>
      </div>
    </div>
  </Sidebar>
</template>

<script setup>
// IMPORTS
import  { ref } from 'vue';

// DEPENDENCIES

// INJECT

// PROPS, EMITS
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  role: {
    type: Object,
    default: () => {},
  },
});

// REFS
const visible = ref(false);

// COMPUTED

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
