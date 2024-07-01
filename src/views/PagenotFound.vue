<script setup lang="ts">
import { useRouter  } from 'vue-router';

const route = useRouter();
const goBack = ()=>{
  // window.history.back();
  route.push('/')


}
</script>

<template>
  <div class="flex-1 flex flex-col justify-center items-center h-screen">
    <img src="../assets/images/404-error.png" class="w-1/4">
    <div class="text-center">
      <h1 class="text-3xl  text-neutral-900 ">Page not Found</h1>
      <p class="text-neutral-500">The page you are looking for is not available</p>
    </div>
    <div class="mt-4">
      <button
          @click="goBack"
          class="btn btn-primary bt-sm lg:btn-lg md:btn-md"
      >Go back</button>
    </div>
  </div>
</template>