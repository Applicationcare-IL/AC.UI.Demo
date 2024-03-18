import { storeToRefs } from "pinia";

import { useAssetsStore } from "@/stores/assetsStore";

export function useAssets() {
  const assetsStore = useAssetsStore();
  const { selectedAssets } = storeToRefs(assetsStore);

  // ACTIONS
  const getAssetsFromApi = async (params) => {
    const response = await assetsStore.getAssetsFromApi(params);

    const assets = response.data.map((asset) => {
      return mapAsset(asset);
    });

    const totalRecords = response.meta.total;

    return { data: assets, totalRecords };
  };

  const getAssetFromApi = async (id) => {
    const response = await assetsStore.getAssetFromApi(id);
    return mapAsset(response.data);
  };

  const deactivateAsset = async (id) => {
    return await assetsStore.deactivateAsset(id);
  };

  // UTILITIES
  const mapAsset = (asset) => {
    return {
      id: asset.id,
      number: asset.number,
      title: asset.number,
      type: asset.asset_type,
      owner: asset.asset_owner,
      payer: asset.asset_payer,
      consumer: asset.asset_consumer,
      usage_start_date: asset.usage_start_date,
      usage_end_date: asset.usage_end_date,
      last_inspection_date: asset.last_inspection_date,
      status: asset.status,
      state: asset.state,
      open_services: asset.open_services,
      breached_services: asset.breached_services,
      open_tasks: asset.open_tasks,
      breached_tasks: asset.breached_tasks,
      service_emergency_area: asset.service_emergency_area,
      service_area: asset.service_area,
      service_collection_area: asset.service_collection_area,
      service_tax_area: asset.service_tax_area,
      water_meter_number: asset.water_meter_number,
      water_meter_type: asset.water_meter_type,
      water_meter_installation_date: asset.water_meter_installation_date,
      water_meter_status: asset.water_meter_status,
      water_last_meter_reading: asset.water_last_meter_reading,
      water_last_meter_reading_date: asset.water_last_meter_reading_date,
      water_meter_brand: asset.water_meter_brand,
      water_meter_location: asset.water_meter_location,

      location: {
        house_number: asset.location?.house_number,
        appartment: asset.location?.apartment,
        entrance: asset.location?.entrance,
        street: asset.location?.street,
        city: asset.location?.city,
        country: asset.location?.country,
        zip: asset.location?.zip?.id,
        neighborhood: asset.location?.neighborhood,
      },
    };
  };

  const getAsset = (id) => {
    return Promise.resolve(
      this.getAssetsData().find((asset) => asset.asset_id === id)
    );
  };

  return {
    // ACTIONS
    getAssetsFromApi,
    getAssetFromApi,
    deactivateAsset,

    // SELECTED ASSETS
    selectedAssets,
    setSelectedAssets: assetsStore.setSelectedAssets,
    addSelectedAsset: assetsStore.addSelectedAsset,
    removeSelectedAsset: assetsStore.removeSelectedAsset,
    resetSelectedAssets: assetsStore.resetSelectedAssets,

    // UTILITIES
    mapAsset,

    // MOCKED DATA
    getAsset,
  };
}
