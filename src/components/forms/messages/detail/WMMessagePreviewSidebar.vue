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
      <div class="task-data flex flex-auto flex-column gap-5">
        <h3 class="h3">{{ $t('message.detail') }}</h3>

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
            <WMInput
                :highlighted="true"
                :label="$t('message.rating') + ':'"
            >
              <WMImportantState :important="props.message.important" />
            </WMInput>
          </div>
        </div>
        <div class="wm-form-row align-items-end gap-5">
          <div class="wm-form-row gap-5">
            <WMInput
                name="topic"
                type="info"
                :highlighted="true"
                :label="$t('start-date') + ':'"
                :value="props.message.start_date"
            />

            <WMInput
                v-if="props.message.end_date"
                name="topic"
                type="info"
                :highlighted="true"
                :label="$t('end-date') + ':'"
                :value="props.message.end_date"
            />
          </div>
        </div>

        <Divider />
        <h3 class="h3 mt-0">{{ $t('message.content') }}</h3>

        <div class="wm-form-row align-items-end gap-5">
          <div class="wm-form-row gap-5">
            <WMInput
                name="message"
                type="info"
                :highlighted="true"
                :value="props.message.message"
                size="full"
            />
            </div>
          </div>
        <Divider />

        <div v-if="message.target === 'employee'">
          <h3 class="h3">{{ $t('message.target') + ' - ' + $t('message.employee') }}</h3>
          <div class="wm-form-row align-items-end gap-5">
            <div class="wm-form-column flex flex-column gap-5">
              <div v-if="props.message.teams" class="flex flex-wrap gap-2 flex-column">
                <label class="wm-form-label highlighted">{{ $t('teams') + ':' }}</label>
                <div class="flex gap-2">
                  <Chip
                      v-for="(item, index) in props.message.teams"
                      :key="index"
                      class="p-chip--purple">
                    <span>{{ item.name }}</span>
                  </Chip>
                </div>
              </div>
              <div class="flex flex-wrap gap-2 flex-column">
                <label class="wm-form-label highlighted">{{ $t('roles') + ':' }}</label>
                <div v-if="props.message.roles" class="flex gap-2">
                  <Chip
                      v-for="(item, index) in props.message.roles"
                      :key="index"
                      class="p-chip--purple">
                    <span>{{ item.name }}</span>
                  </Chip>
                </div>
              </div>
              <div v-if="props.message.users" class="flex flex-wrap gap-2 flex-column">
                <label class="wm-form-label highlighted">{{ $t('users') + ':' }}</label>
                <div class="flex gap-2">
                  <Chip
                      v-for="(item, index) in props.message.users"
                      :key="index"
                      class="p-chip--purple">
                    <span>{{ item.name }}</span>
                  </Chip>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div v-if="message.target === 'service'">
          <h3 class="h3">{{ $t('message.target') + ' - ' + $t('message.service') }}</h3>

          <div class="wm-form-row align-items-end gap-5">
          <div class="task-data flex flex-auto flex-column gap-5 mb-5">

            <div class="wm-form-row align-items-end gap-5">
              <div class="wm-form-row gap-5">
                <WMInput
                    name="service_area"
                    type="info"
                    :highlighted="true"
                    :label="$t('message.service-area') + ':'"
                    :value="props.message.service_area?.value"
                />
                <WMInput
                    name="service_type_id"
                    type="info"
                    :highlighted="true"
                    :label="$t('message.service-detail') + ':'"
                    :value="props.message.service_type?.value"
                />
                <WMInput
                    name="service_request_1"
                    type="info"
                    :highlighted="true"
                    :label="$t('message.request') + ' 1:'"
                    :value="props.message.service_request_1?.value"
                />
              </div>
            </div>
            <div class="wm-form-row align-items-end gap-5">
              <div class="wm-form-row gap-5">
                <WMInput
                    name="service_request_2"
                    type="info"
                    :highlighted="true"
                    :label="$t('message.request') + ' 2:'"
                    :value="props.message.service_request_2?.value"
                />
                <WMInput
                    name="service_request_3"
                    type="info"
                    :highlighted="true"
                    :label="$t('message.request') + ' 3:'"
                    :value="props.message.service_request_3?.value"
                />
              </div>
            </div>

          </div>
          </div>
        </div>

        <div v-if="message.target === 'customer'">
          <h3 class="h3">{{ $t('message.target') + ' - ' + $t('message.customer') }}</h3>

          <div class="wm-form-row align-items-end gap-5">
          <div class="task-data flex flex-auto flex-column gap-5 mb-5">

            <div class="flex flex-wrap gap-2 flex-column">
              <label class="wm-form-label highlighted">{{ $t('message.organization-type') + ':' }}</label>
              <div class="flex gap-2">
                <Chip
                    v-for="(item, index) in props.message.customer_types"
                    :key="index"
                    class="p-chip--purple">
                  <span>{{ item.value }}</span>
                </Chip>
              </div>
            </div>
            <div class="flex flex-wrap gap-2 flex-column">
              <label class="wm-form-label highlighted">{{ $t('message.rating') + ':' }}</label>
              <div class="flex gap-2">
                <Chip
                    v-for="(item, index) in props.message.customer_ratings"
                    :key="index"
                    class="p-chip--purple">
                  <span>{{ item.value }}</span>
                </Chip>
              </div>
            </div>
            <div class="flex flex-wrap gap-2 flex-column">
              <label class="wm-form-label highlighted">{{ $t('message.service-area') + ':' }}</label>
              <div class="flex gap-2">
                <Chip
                    v-for="(item, index) in props.message.customer_service_areas"
                    :key="index"
                    class="p-chip--purple">
                  <span>{{ item.value }}</span>
                </Chip>
              </div>
            </div>

          </div>
          </div>
        </div>

        <div v-if="message.target === 'project'">
          <h3 class="h3">{{ $t('message.target') + ' - ' + $t('message.project') }}</h3>

          <div class="wm-form-row align-items-end gap-5">
            <div class="task-data flex flex-auto flex-column gap-5 mb-5">

              <div class="wm-form-row align-items-end gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                      name="service_area"
                      type="info"
                      :highlighted="true"
                      :label="$t('message.service-area') + ':'"
                      :value="props.message.project_area?.value"
                  />
                  <WMInput
                      name="service_type_id"
                      type="info"
                      :highlighted="true"
                      :label="$t('message.service-detail') + ':'"
                      :value="props.message.project_type?.value"
                  />
                  <WMInput
                      name="service_request_1"
                      type="info"
                      :highlighted="true"
                      :label="$t('message.request') + ' 1:'"
                      :value="props.message.project_type?.value"
                  />
                </div>
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

import WMImportantState from "@/components/tables/WMImportantState.vue";

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
