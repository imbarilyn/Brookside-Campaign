<script setup lang="ts">
import { computed, ref } from 'vue'
import {useNotificationStore} from "@/stores";


const notificationStore = useNotificationStore()

interface NotificationItem {
  message:string;
  type: 'success'|'error'| 'warning'|'info';
  isShown: boolean;
  duration: number
  id:string;
}

const props = defineProps<NotificationItem>()

const alertToastToggle = ref(props.isShown)

// backgroundColor
const   alertBgColor = computed(()=>{
  if(props.type === 'success'){
    return 'bg-green-100'
  }
  else if(props.type === 'warning'){
    return 'bg-yellow-100'
  }
  else if(props.type === 'error'){
    return 'bg-red-100'
  }
  else if(props.type === 'info'){
    return 'bg-blue-100'
  }
  return 'bg-blue-100'
})

// textColor

const alertTextColor = computed(()=>{
  if(props.type === 'success'){
    return 'text-green-500'
  }
  else if(props.type === 'warning'){
    return 'text-yellow-500'
  }
  else if(props.type === 'error'){
    return 'text-red-500'
  }
  else if(props.type === 'info'){
    return 'text-blue-500'
  }
  return 'text-blue-500'
})

// alertIcon

const alertIcon = computed(()=>{
  if(props.type === 'success'){
    return 'circle-check'
  }
  else if(props.type === 'error'){
    return 'error'
  }
  else if(props.type === 'warning'){
    return 'warning'
  }
  else if (props.type === 'info'){
    return 'info'
  }
  return 'info'
})

// dashBgColor

const alertDashColor = computed(()=>{
  if(props.type === 'success'){
    return 'bg-green-500'
  }
  else if(props.type === 'warning'){
    return 'bg-yellow-500'
  }
  else if(props.type === 'error'){
    return 'bg-rose-500'
  }
  else if(props.type === 'info'){
    return 'bg-blue-500'
  }
  return 'bg-blue-500'
})


const closeAlert = ()=>{
  // alertToastToggle.value = false
  console.log(props.id)
  notificationStore.removeNotification(props.id)
}





</script>



<template>
<div class="grid grid-cols-6 w-96  bg-green-100 relative drop-shadow-lg py-5 rounded-lg"
     :class="[alertBgColor, !(alertToastToggle || props.isShown) ? 'hiding': '']"
>
  <div class="absolute inset-y-0 left-0 w-1" :class="alertDashColor"></div><!--  <div class="absolute inset-y-0 left-0 w-1 bg-red-500"></div>-->
  <div class="flex items-center justify-center col-span-1">
    <span class="material-icons-outlined text-4xl" :class="alertTextColor">{{alertIcon}}</span>
  </div>
  <div class="flex items-center justify-center col-span-4">
    <p class="text-sm star" :class="alertTextColor">{{props.message}}</p>
  </div>
  <div class="flex items-center justify-center col-span-1">
    <button @click=" closeAlert">
      <span class="material-icons-outlined">close</span>
    </button>

  </div>
</div>
</template>