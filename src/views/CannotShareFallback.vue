<script setup lang="ts">
import { useRouter  } from 'vue-router';

const route = useRouter();
const goBack = ()=>{
  route.push('/')

}

</script>


<template>
  <div class="flex-1 flex flex-col justify-center items-center h-screen">
    <div class="w-full flex justify-center">
      <span class="text-8xl">&#128549;</span>
    </div>
    <h1 class="font-bold text-3xl text-neutral-900">Oops!</h1>
    <p class="text-neutral-500 py-3">Looks like you cannot share files try a <span class="font-bold">different browser</span></p>
    <button @click="goBack" class="btn btn-primary btn-sm lg:btn-lg md:btn-md">Go back</button>
  </div>


</template>