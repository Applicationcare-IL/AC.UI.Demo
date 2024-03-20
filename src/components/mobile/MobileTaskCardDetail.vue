<template>
  <Card>
    <template #content>
      <router-link :to="{ name: 'taskDetailMobile', params: { id: task.id } }">
        <div
          class="flex flex-row gap-3 justify-content-between align-items-start task-card-detail"
        >
          <div
            class="task-card-detail-list"
            :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
          >
            <div class="info">
              <strong>{{ $t("contact.id") }}:</strong> {{ task.id }}
            </div>
            <div>
              <strong> {{ $t("contact.contact") }}:</strong>
              {{ contactFullName }}
            </div>
            <div v-if="location">
              <strong>{{ $t("address.address") }}:</strong> {{ location }}
            </div>

            <template v-if="task.status.value == 'open'">
              <div>
                <strong>{{ $t("task.days-till-closure") }}:</strong>
                {{ daysTillClosure }}
              </div>
              <div>
                <strong>{{ $t("task.due_date") }}:</strong> {{ task.due_date }}
              </div>
            </template>

            <template v-if="task.status.value == 'completed'">
              <div>
                <strong>{{ $t("task.close_date") }}e:</strong>
                {{ task.close_date }}
              </div>
            </template>

            <div v-if="task.service_request_1">
              <strong>{{ $("task.request-1") }}:</strong>
              {{ task.service_request_1 }}
            </div>
          </div>
          <div class="image-container">
            <img src="https://placehold.co/200x400" />
          </div>
          <div>
            <i
              class="pi pi-clock font-bold"
              :class="SLAStatusColor"
              style="font-size: 1rem"
            ></i>
          </div>
        </div>
      </router-link>
    </template>
  </Card>
</template>

<script setup>
import { computed } from "vue";

import { useLayout } from "@/layout/composables/layout";
const { layoutConfig } = useLayout();

const { optionLabelWithLang } = useLanguages();

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

const contactFullName = computed(() => {
  return `${props.task.contact?.name} ${props.task.contact?.surname}`;
});

const location = computed(() => {
  if (!props.task.related_entity?.location) {
    return false;
  }

  const city = props.task.related_entity.location?.city
    ? props.task.related_entity.location.city[optionLabelWithLang.value]
    : "";

  const street = props.task.related_entity.location?.street
    ? props.task.related_entity.location.street[optionLabelWithLang.value]
    : "";

  const number = props.task.related_entity.location?.house_number
    ? props.task.related_entity.location.house_number
    : "";

  return `${street},  ${number}, ${city}`;
});

const daysTillClosure = computed(() => {
  const dueDate = new Date(props.task.due_date);
  const today = new Date();
  const timeDiff = dueDate.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff;
});

const SLAStatusColor = computed(() => {
  switch (props.task.sla.sla) {
    case "no_breach":
      return "green";
    case "breached":
      return "red";
    case "near_breach":
      return "orange";
    default:
      return "black";
  }
});
</script>

<style scoped lang="scss">
.task-card-detail {
  color: var(--surface-700) !important;
}

.task-card-detail-list.layout-rtl {
  > div {
    text-align: right;
    display: flex;
    gap: 0.5em;
  }
}

.image-container {
  aspect-ratio: 9 / 16;
  max-width: 80px;
  max-height: 110px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.green {
  color: var(--green-500) !important;
}

.red {
  color: var(--red-500) !important;
}

.orange {
  color: var(--orange-500) !important;
}
</style>
