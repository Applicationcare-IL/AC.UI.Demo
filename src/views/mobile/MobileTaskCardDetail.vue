<template>
  <Card>
    <template #content>
      <router-link :to="{ name: 'taskDetailMobile', params: { id: task.id } }">
        <div
          class="flex flex-row gap-3 justify-content-between align-items-start task-card-detail"
        >
          <div>
            <div><strong>ID:</strong> {{ task.id }}</div>
            <div><strong>Contact:</strong> {{ task.contact }}</div>
            <div><strong>Address:</strong> {{ task.address }}</div>

            <template v-if="type == 'open'">
              <div>
                <strong>Days till closure:</strong>
                {{ task.days_till_closure }}
              </div>
              <div><strong>Due date:</strong> {{ task.due_date }}</div>
            </template>

            <template v-if="type == 'closed'">
              <div><strong>Close date:</strong> {{ task.close_date }}</div>
            </template>
            <div><strong>Request 1:</strong> {{ task.service_request_1 }}</div>
          </div>
          <div>IMAGE</div>
          <div>
            <i class="pi pi-clock font-bold" style="font-size: 1rem"></i>
          </div>
        </div>
      </router-link>
    </template>
  </Card>
</template>

<script setup>
defineProps({
  task: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped lang="scss">
.task-card-detail {
  color: var(--surface-700) !important;
}
</style>
