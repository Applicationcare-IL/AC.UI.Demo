<template>
  <Story :layout="{ type: 'grid', width: '50%' }">
    <Variant title="Default (positive)">
      <WMInlineTrendingTime text="זמן ממוצע שלי" time="00:10:46" quantity="4" />
    </Variant>
    <Variant title="Negative">
      <WMInlineTrendingTime text="זמן ממוצע שלי" time="00:10:46" quantity="-2" />
    </Variant>
  </Story>
</template>

<script setup></script>
