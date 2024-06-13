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
          <WMButton :text="$t('budget.open-budget')" type="primary" />
        </router-link>
      </div>
    </template>
    <template #content>
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="flex-1 w-full">
          <div class="flex flex-column gap-5">
            <div class="flex flex-row justify-content-between gap-3">
              <WMHighlightedBlock
                v-model="budget.estimate"
                background-color="purple-100"
                :label="$t('budget.estimate') + ':'"
              />

              <Divider layout="vertical" />
              <WMHighlightedBlock
                v-model="budget.planned_contract"
                background-color="blue-100"
                :label="$t('budget.planned-contract') + ':'"
              />
              <PlusIcon />
              <WMHighlightedBlock
                v-model="budget.unexpected"
                background-color="blue-100"
                :label="$t('budget.unexpected') + ':'"
              />
              <PlusIcon />
              <WMHighlightedBlock
                v-model="budget.management_fee"
                background-color="blue-100"
                :label="$t('budget.management-fee') + ':'"
              />
              <EqualIcon />
              <WMHighlightedBlock
                v-model="budget.total_approved"
                background-color="blue-200"
                :label="$t('budget.total') + ':'"
              />
              <Divider layout="vertical" />
              <WMHighlightedBlock
                v-model="budget.total_without_fee"
                background-color="blue-200"
                :label="$t('budget.total-without-fee') + ':'"
              />
            </div>
            <div class="flex flex-row gap-3">
              <WMHighlightedBlock
                v-model="budget.approved_council"
                background-color="green-100"
                :label="$t('budget.approved-council') + ':'"
              />

              <ArrowIcon :class="layoutConfig.isRTL.value ? '' : 'rotate-180'" />

              <WMHighlightedBlock
                v-model="budget.approved_ministry"
                background-color="green-100"
                :label="$t('budget.approved-ministry') + ':'"
              />

              <Divider layout="vertical" />

              <WMHighlightedBlock
                v-model="budget.executed_payments"
                background-color="transparent"
                :label="$t('budget.executed-payments') + ':'"
              />

              <WMHighlightedBalanceBlock
                :quantity="budget.balance"
                :label="$t('budget.balance') + ':'"
              />

              <Divider layout="vertical" />

              <WMHighlightedBlock
                v-model="budget.total_funding"
                background-color="gray-300"
                :label="$t('budget.total-funding') + ':'"
              />

              <Divider layout="vertical" class="opacity-0" />

              <WMHighlightedBalanceBlock
                :quantity="budget.funding_balance"
                :label="$t('budget.funding-balance') + ':'"
              />
            </div>
          </div>
        </div>
      </div>
      <Divider class="my-5" />

      <div class="flex flex-row gap-5 flex-wrap mt-5">
        <div class="flex-1">
          <div class="flex align-items-center justify-content-between gap-3 mb-4">
            <span class="p-card-title">{{ $t("budget.funding") }}</span>
            <div>
              <span class="h6">{{ $t("budget.tbr-number") }}:</span>
              {{ budget.tbr_number }}
            </div>
          </div>

          <div class="flex flex-column gap-2">
            <div class="flex flex-row justify-content-between gap-5">
              <WMHighlightedBlock
                v-model="budget.tbr_accepted"
                name="tbr_accepted"
                background-color="gray-100"
                :label="$t('budget.tbr-accepted') + ':'"
                size="small"
              />
              <PlusIcon />

              <WMHighlightedBlock
                v-model="budget.tbr_expected"
                name="tbr_expected"
                background-color="gray-100"
                :label="$t('budget.tbr-expected') + ':'"
                size="small"
              />
              <EqualIcon />
              <WMHighlightedBlock
                v-model="budget.tbr_funding"
                name="tbr_funding"
                background-color="gray-300"
                :label="$t('budget.tbr-funding') + ':'"
                size="small"
              />
            </div>

            <div class="flex flex-row justify-content-between gap-5 mt-3">
              <WMHighlightedBlock
                v-model="budget.funds_accepted_non_tbr"
                name="funds_accepted_non_tbr"
                background-color="gray-100"
                :label="$t('budget.non-tbr-funds-accepted') + ':'"
                size="small"
              />
              <PlusIcon />
              <WMHighlightedBlock
                v-model="budget.expected_non_tbr"
                name="expected_non_tbr"
                background-color="gray-100"
                :label="$t('budget.non-tbr-expected') + ':'"
                size="small"
              />
              <EqualIcon />
              <WMHighlightedBlock
                v-model="budget.funding_non_tbr"
                background-color="gray-300"
                :label="$t('budget.non-tbr-funding') + ':'"
                size="small"
              />
            </div>
          </div>
        </div>
        <Divider layout="vertical" />
        <div class="flex-1">
          <span class="p-card-title">
            <div class="flex align-items-center gap-3 mb-4">
              {{ $t("budget.records-and-reports") }}
            </div>
          </span>

          <div class="flex flex-column gap-2">
            <div class="flex flex-row align-items-center justify-content-between gap-2">
              <WMHighlightedBlock
                v-model="budget.tbr_reported"
                name="tbr_reported"
                background-color="transparent"
                :label="$t('budget.tbr-reported') + ':'"
                size="small"
              />

              <WMHighlightedBlock
                v-model="budget.tbr_municipality_expenses"
                name="tbr_municipality_expenses"
                background-color="transparent"
                :label="$t('budget.tbr-municipality-expenses') + ':'"
                size="small"
                class="mr-2"
              />

              <WMHighlightedBalanceBlock
                name="tbr_balance"
                :quantity="budget.tbr_balance"
                :label="$t('budget.tbr-balance') + ':'"
                size="small"
                class="mr-2"
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

import { useLayout } from "@/layout/composables/layout";

const { layoutConfig } = useLayout();

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});

const budget = ref(props.project.budget);
</script>

<style scoped lang="scss"></style>
