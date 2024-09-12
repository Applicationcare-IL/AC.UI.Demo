<template>
  <Sidebar
    v-if="product"
    v-model:visible="visible"
    class="details-sidebar w-6"
    :show-close-icon="false"
    @update:model-value="updateModelValue"
  >
    <div class="flex flex-auto flex-column overflow-auto w-full px-2">
      <div class="flex justify-content-between">
        <h2 class="h2">{{ product.name }}</h2>
        <router-link
          :to="{
            name: 'productDetail',
            params: { id: product.id },
          }"
          class="p-2"
        >
          <Button>Edit</Button>
        </router-link>
      </div>
      <Divider />

      <div class="flex flex-column gap-4">
        <div class="wm-form-row gap-5">
          <WMInput
              name="manufacturer"
              type="info"
              :highlighted="true"
              :label="$t('product.manufacturer') + ':'"
              :value="product.manufacturer.name"
          />
          <WMInput
              name="units"
              type="info"
              :highlighted="true"
              :label="$t('product.units') + ':'"
              :value="product.units.value"
          />
        </div>
        <div class="wm-form-row gap-5">

          <div class="wm-input flex flex-column">
            <label class="wm-form-label highlighted">
              {{ $t('product.base-price') + ':' }}
            </label>
            <span class="wm-input-sm">
              <img class="input-currency__icon vertical-align-middle" src="/icons/shekel.svg" alt=""/>
              {{ product.base_price }}
            </span>
          </div>

          <div v-if="product.discount_number" class="wm-input flex flex-column">
            <label class="wm-form-label highlighted">
              {{
                product.discount_type === 'number' ? $t('product.discount-number') + ':' : $t('product.discount-percentage') + ':'
              }}
            </label>
            <span class="wm-input-sm">
              <img v-if="product.discount_type === 'number'"
                   class="input-currency__icon vertical-align-middle" src="/icons/shekel.svg" alt=""/>
              {{ product.discount_number }}
              <img v-if="product.discount_type === 'percentage'"
                   class="input-currency__icon vertical-align-middle" src="/icons/percentage.svg" alt=""/>
            </span>
          </div>

          <div class="wm-input flex flex-column">
            <label class="wm-form-label highlighted">
              {{ $t('product.minimum-price') + ':' }}
            </label>
            <span class="wm-input-sm">
              <img class="input-currency__icon vertical-align-middle" src="/icons/shekel.svg" alt=""/>
              {{ product.min_price }}
            </span>
          </div>

        </div>
      </div>

      <Divider/>

      <div class="wm-form-row align-items-baseline">
        <div class="flex flex-column gap-5">
          <div class="wm-form-row gap-5 align-items-baseline">
            <WMInput
                name="billing_type"
                type="info"
                :highlighted="true"
                size="sm"
                :label="$t('product.billing-type') + ':'"
                :value="product.billing_type.value"
            />
            <WMInput
                name="renewal_type"
                type="info"
                :highlighted="true"
                size="sm"
                :label="$t('product.renewal-type') + ':'"
                :value="product.renewal_type.value"
            />
            <WMInput
                name="cancellation_type"
                type="info"
                :highlighted="true"
                size="sm"
                :label="$t('product.cancellation-type') + ':'"
                :value="product.cancellation_type.value"
            />
          </div>
          <div class="wm-form-row gap-5 align-items-baseline">
            <WMInput
                name="info_page"
                type="info-link"
                :highlighted="true"
                size="sm"
                :label="$t('product.information-page') + ':'"
                :value="product.info_page"
            />
            <WMInput
                name="marketing_page"
                type="info-link"
                :highlighted="true"
                size="sm"
                :label="$t('product.marketing-info') + ':'"
                :value="product.marketing_info"
            />
            <WMInput
                name="technical_page"
                type="info-link"
                :highlighted="true"
                size="sm"
                :label="$t('product.technical-info') + ':'"
                :value="product.technical_info"
            />
          </div>
        </div>

        <div class="wm-form-row gap-5">
          <div class="wm-input flex flex-column w-full">
            <label class="wm-form-label highlighted">
              {{ $t('description') + ':' }}
            </label>
            <span class="w-full text-overflow-ellipsis overflow-hidden bg-gray-100 p-2 border-round-lg">
              {{ product.description }}
            </span>
          </div>
        </div>
      </div>

      <Divider/>

      <div class="flex flex-row">
        <DataTable
            lazy
            :value="bulkDiscount"
            data-key="id"
            scrollable
            paginator
            :rows="5"
            :total-records="totalRecords"
            class="w-full"
            @page="onPage($event)"
        >
          <Column
              v-for="column in columns"
              :key="column.name"
              :field="column.name"
              :header="$t(column.header)"
              :class="column.class"
              :style="column.width ? { width: column.width } : {}"
          >
            <template #body="{ data }">
              <WMRenderTableFieldBody v-model="data[column.field]" :column-data="column"/>
            </template>
          </Column>
        </DataTable>

        <Divider layout="vertical"/>

        <div class="flex flex-row gap-5">
          <div class="flex flex-column gap-5">
            <WMProductSettingPreview
                :title="$t('product.license')"
                :state="product.licensing_required"
            />
            <WMProductSettingPreview
                :title="$t('product.commitment')"
                :state="product.commitment"
            />
            <WMProductSettingPreview
                :title="$t('product.guarantee')"
                :state="product.warranty"
            />
          </div>
          <div class="flex flex-column gap-5">
            <WMProductSettingPreview
                :title="$t('product.installation')"
                :state="product.installation_required"
            />

            <WMProductSettingPreview
                :title="$t('product.provisioning')"
                :state="product.provisioning_required"
            />
            <WMProductSettingPreview
                :title="$t('product.maintenance')"
                :state="product.maintenance_required"
            />
          </div>
        </div>

      </div>

      <!--      <pre>{{ product }}</pre>-->
    </div>
  </Sidebar>
</template>

<script setup>
// IMPORTS
import { onMounted, ref } from "vue";

// DEPENDENCIES
const {getProduct, getProductDiscounts} = useProducts();

// INJECT

// PROPS, EMITS
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  productId: {
    type: Number,
    required: true,
  },
});

// REFS
const visible = ref(false);
const product = ref({});
const bulkDiscount = ref();
const totalRecords = ref(0);
const lazyParams = ref({});

const columns = [
  {
    name: "quantity",
    type: "text",
    field: "quantity",
    header: "quantity",
  },
  {
    name: "discount_number",
    type: "text",
    field: "discount_number",
    header: "product.discount-number",
  },
];

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  product.value = await getProduct(props.productId);
  const nextPage = lazyParams.value.page + 1;

  const params = new URLSearchParams({
    page: nextPage ? nextPage : 1,
    per_page: 5,
  });

  let response = await getProductDiscounts(props.productId, params);
  bulkDiscount.value = response.data;
  totalRecords.value = response.totalRecords;
}

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};
// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  loadLazyData();
});


</script>

<style scoped></style>
