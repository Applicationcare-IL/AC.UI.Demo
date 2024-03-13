import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useAssetsStore = defineStore("assets", {
  state: () => ({
    selectedAssets: [],
  }),
  actions: {
    getAssetFromApi(id) {
      return axiosConfig
        .get("/assets/" + id)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    getAssetsFromApi(params) {
      return axiosConfig
        .get("/assets", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    deactivateAsset(ids) {
      const params = {
        ids: ids,
      };

      return axiosConfig
        .patch("/assets/deactivate", params)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    // // SELECTED ASSETS
    setSelectedAssets(assets) {
      this.selectedAssets = assets;
    },
    addSelectedAsset(asset) {
      this.selectedAssets.push(asset);
    },
    removeSelectedAsset(asset) {
      this.selectedAssets = this.selectedAssets.filter(
        (item) => item.id !== asset.id
      );
    },
    resetSelectedAssets() {
      this.selectedAssets = [];
    },
  },
});
