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
    <template #content>
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="flex-1 card-container top-info-card">
          <div class="flex flex-column gap-4">
            <div class="flex flex-row gap-7 align-items-center">
              <WMHighlightedBlock
                v-model="budget.total_planned"
                size="small"
                background-color="blue-200"
                :label="$t('budget.total') + ':'"
              />
              <WMHighlightedBlock
                v-model="budget.estimate"
                size="small"
                background-color="purple-100"
                :label="$t('budget.estimate') + ':'"
              />
              <WMHighlightedBlock
                v-model="budget.non_tbr_funding"
                size="small"
                background-color="gray-200"
                :label="$t('budget.non-tbr-funding') + ':'"
              />
            </div>
            <div class="flex flex-row gap-7">
              <WMHighlightedBlock
                v-model="budget.approved"
                size="small"
                background-color="gray-50"
                :label="$t('budget.approved') + ':'"
              />
              <WMHighlightedBlock
                v-model="budget.executed_payments"
                size="small"
                background-color="gray-50"
                :label="$t('budget.executed-payments') + ':'"
              />
              <WMHighlightedBalanceBlock
                size="small"
                :quantity="budget.balance"
                :label="$t('budget.total') + ':'"
              />
            </div>
            <Divider></Divider>
            <div class="flex flex-row justify-content-between gap-3">
              <h3 class="h3 mb-0">
                {{ budget.tbr_number + " " + $t("budget.tbr-number") }}
              </h3>
            </div>
            <div class="flex flex-row gap-7">
              <WMHighlightedBlock
                v-model="budget.tbr_funding"
                size="small"
                background-color="gray-200"
                :label="$t('budget.tbr-funding') + ':'"
              />

              <WMHighlightedBlock
                v-model="budget.tbr_reported"
                size="small"
                background-color="gray-50"
                :label="$t('budget.tbr-reported') + ':'"
              />
              <WMHighlightedBlock
                v-model="budget.tbr_municipality_expenses"
                size="small"
                background-color="gray-50"
                :label="$t('budget.tbr-municipality-expenses') + ':'"
              />
              <WMHighlightedBalanceBlock
                size="small"
                :quantity="budget.tbr_balance"
                :label="$t('budget.tbr-balance') + ':'"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});

const budget = ref(props.project.budget);
</script>

<style scoped lang="scss"></style>
