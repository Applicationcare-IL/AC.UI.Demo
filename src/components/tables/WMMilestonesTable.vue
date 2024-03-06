<template>
  <WMSidebar
    :visible="isVisible"
    name="newMilestone"
    @close-sidebar="closeSidebar"
    @open-sidebar="openSidebar"
  >
    <template #default> NEW MILESTONE FORM </template>
  </WMSidebar>
  <div class="flex flex-column gap-3 mb-3">
    <div class="flex flex-row justify-content-between">
      <div class="flex flex-row">
        <WMButton
          class="m-1 col-6"
          name="new"
          icon="new"
          icon-position="right"
          @click="toggleSidebarVisibility"
        >
          {{ $t("buttons.new") }}
        </WMButton>
      </div>
    </div>
  </div>
  <pre>{{ milestones }}</pre>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  projectId: {
    type: Number,
    required: true,
  },
});

const { getProjectMilestones } = useProjects();

const milestones = ref([]);

const isVisible = ref(false);

function toggleSidebarVisibility() {
  isVisible.value = !isVisible.value;
}

function closeSidebar() {
  isVisible.value = false;
}

function openSidebar() {
  isVisible.value = true;
}

getProjectMilestones(props.projectId).then((response) => {
  milestones.value = response.data;
});
</script>
