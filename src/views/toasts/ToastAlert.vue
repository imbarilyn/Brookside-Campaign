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
    return 'bg-re-100'
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
    return 'text-re-500'
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
    return 'bg-re-500'
  }
  else if(props.type === 'info'){
    return 'bg-blue-500'
  }
  return 'bg-blue-500'
})

const alertIconName = computed(()=>{
  if(props.type === 'success'){
    return 'check_circle'
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

const closeAlert = ()=>{
  alertToastToggle.value = false
  useNotifcationStore.removeNotification(props.id)
}





</script>



<template>

<!--<div class=" grid grid-col-12 flex-1 rounded-md transition duration-200 ease-in-out ">-->
<!--  <div class="insert-y-0 left-0 bg-red-100"></div>-->
<!--  <div class="col-span-2" :class="alertIcon">-->
<!--    <span>{{alertIcon}}</span>-->
<!--  </div>-->


<!--</div>-->



</template>