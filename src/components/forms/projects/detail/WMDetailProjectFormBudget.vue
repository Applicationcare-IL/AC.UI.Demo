<template>
  <Card>
    <template #title>
      <div class="flex flex-row justify-content-between">
        {{ $t("project.project-budget") }}
        <router-link
          :to="{
            name: 'projectBudget',
            params: { id: project.project_id },
          }"
          target="_blank"
        >
          <Button>
            {{ $t("budget.open-budget") }}
          </Button>
        </router-link>
      </div>
    </template>
    <template #content> </template>
  </Card>
</template>

<script setup>
defineProps({
  project: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped lang="scss"></style>
