<template>
  <Sidebar
      v-if="props.user"
      v-model:visible="visible"
      class="details-sidebar w-4"
      :show-close-icon="false"
      :class="''"
      @update:model-value="updateModelValue"
  >
    <div class="flex flex-auto flex-column overflow-auto w-full px-2">
      <div class="flex justify-content-between">
        <h2 class="h2">{{ props.user.username }}</h2>
        <router-link
          :to="{
            name: 'adminUserDetail',
            params: { id: props.user.id },
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
                :value="props.user.id"
            />
            <WMInput
                name="state"
                type="info"
                :highlighted="true"
                :label="$t('state') + ':'"
                :value="props.user.state.value"
                :class="statusClass(props.user.state.value)"
            />
            </div>
        </div>
        <div class="wm-form-row align-items-end gap-5">
          <div class="wm-form-row gap-5">
            <WMInput
                name="phone"
                type="info"
                :highlighted="true"
                :label="$t('mobile') + ':'"
                :value="props.user.phone"
            />
            <WMInput
                name="email"
                type="info"
                :highlighted="true"
                :label="$t('email') + ':'"
                :value="props.user.email"
            />
          </div>
        </div>

        <Divider />

        <div class="wm-form-row align-items-end gap-5">
          <div class="wm-form-column flex flex-column gap-5">

            <WMInput
                name="manager"
                type="info"
                :highlighted="true"
                :label="$t('email') + ':'"
                :value="props.user.manager_fullname"
            />

            <div class="flex flex-wrap gap-2 flex-column">
              <label class="wm-form-label highlighted">Teams:</label>
              <div class="flex gap-2">
                <Chip
                    v-for="(item, index) in props.user.teams"
                    :key="index"
                    class="p-chip--purple">
                  <span>{{ item.name }}</span>
                </Chip>
              </div>
            </div>

            <div class="flex flex-wrap gap-2 flex-column">
              <label class="wm-form-label highlighted">Roles:</label>
              <div class="flex gap-2">
                <Chip
                    v-for="(item, index) in props.user.roles"
                    :key="index"
                    class="p-chip--purple">
                  <span>{{ item.name }}</span>
                </Chip>
              </div>
            </div>

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
  user: {
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
