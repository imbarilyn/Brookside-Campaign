<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useCampaignStore } from "@/stores";

const campaignStore = useCampaignStore()

</script>

<template>
<RouterView #default="{ Component, route }">
  <template v-if="Component">
    <component :is="Component" :key="route.fullPath" />

  </template>
  <template v-else-if="campaignStore.isAppFetching">
    <div class="h-screen flex flex-col justify-center items-center">
      <span class="loading loading-spinner loading-md"></span>
      <p class="text-md text-neutral-500 dark:text-neutral-300">Loading...</p>
    </div>


  </template>
</RouterView>
</template>



