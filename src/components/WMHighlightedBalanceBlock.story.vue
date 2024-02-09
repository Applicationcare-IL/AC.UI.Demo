<template>
  <Story :layout="{ type: 'grid', width: '50%' }">
    <!-- <template #controls>
      <HstSelect
        v-model="state.backgroundColor"
        title="Background colors"
        :options="backgroundColorOptions"
      />
    </template> -->
    <Variant title="Positive">
      <WMHighlightedBalanceBlock :quantity="1000" label="Positive balance" />
    </Variant>
    <Variant title="Positive (small)">
      <WMHighlightedBalanceBlock
        :quantity="1000"
        label="Positive balance"
        size="small"
      />
    </Variant>
    <Variant title="Negative">
      <WMHighlightedBalanceBlock :quantity="-1000" label="Negative balance" />
    </Variant>
    <Variant title="Neutral">
      <WMHighlightedBalanceBlock :quantity="0" label="Neutral balance" />
    </Variant>
  </Story>
</template>

<script setup></script>
