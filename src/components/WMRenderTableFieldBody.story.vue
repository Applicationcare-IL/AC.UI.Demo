<template>
  <Story :layout="{ type: 'grid', width: '300px' }">
    <template v-for="column in columns" :key="column.name">
      <Variant :title="`Type: ${column.type}`">
        <WMRenderTableFieldInfo :column="column" :example-data="exampleData" />
      </Variant>
    </template>
  </Story>
</template>
<script setup>
import { reactive } from "vue";

const columns = [
  {
    name: "text",
    type: "text",
    field: "render_text",
    header: "Type Text",
  },
  {
    name: "active",
    type: "state",
    field: "render_state",
    header: "State",
    width: "100px",
    class: "filled-td",
  },
  {
    name: "option-set",
    type: "option-set",
    field: "render_option_set",
    header: "option-set",
  },
  {
    name: "link",
    type: "link",
    field: "render_link",
    header: "link",
    routeName: "routeExample",
  },
  {
    name: "chips",
    type: "chips",
    field: "render_chips",
    header: "chips",
  },
  {
    name: "important",
    type: "important",
    field: "render_important",
    header: "important",
  },
  {
    name: "target",
    type: "target",
    field: "render_target",
    header: "target",
  },
  {
    name: "date",
    type: "date",
    field: "render_date",
    header: "date",
  },
  {
    name: "attachment-image",
    type: "attachment-image",
    field: "render_attachment_image",
    header: "attachment-image",
  },
  {
    name: "currency",
    type: "currency",
    field: "render_currency",
    header: "currency",
  },
  {
    name: "checkbox",
    type: "checkbox",
    field: "render_checkbox",
    header: "checkbox",
  },
  {
    name: "product-discount-type",
    type: "product-discount-type",
    field: "render_product_discount_type",
    header: "product-discount-type",
  },
  {
    name: "sla",
    type: "sla",
    field: "render_sla",
    header: "sla",
  },
  {
    name: "centered-number",
    type: "centered-number",
    field: "render_centered_number",
    header: "centered-number",
  },
  {
    name: "breached-number",
    type: "breached-number",
    field: "render_breached_number",
    header: "breached-number",
  },
  {
    name: "status",
    type: "status",
    field: "render_status",
    header: "status",
  },
];

const exampleData = reactive([
  {
    render_text: "Test",
    render_state: {
      id: 292,
      value: "not_active",
      value_en: "Not Active",
      value_he: "לא פעיל",
      attributes: [],
    },
    render_option_set: {
      id: 2153,
      value: "option_set",
      value_en: "option_set_en",
      value_he: "option_set_he",
      attributes: null,
    },
    render_link: {
      text: "link_text",
      id: 1,
    },
    render_chips: [
      {
        name: "1",
      },
      {
        name: "2",
      },
    ],
    render_important: 0,
    render_target: "service",
    render_date: "12/03/2022",
    render_attachment_image:
      "https://dev-easymaze.mazemateapp.com/api/entity-attachments/589/download?download_token=fta7h9Y2UgtveHWkBv4FNiO3wDiF6IfsGEd89zrcEKzo2TjJRQhyAuEXwLlr&entity_id=6&entity_type=product&quot",
    render_currency: 500.56,
    render_checkbox: 1,
    render_product_discount_type: 23,
    render_sla: {
      due_date: "2024-04-10",
      days_from_opening_date: null,
      days_for_closing: null,
      sla_date: null,
      sla: null,
    },
    render_centered_number: 45,
    render_breached_number: 54,
    render_status: "terminated",
  },
]);
</script>
