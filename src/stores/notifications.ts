import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { v4 as uuidV4 } from 'uuid'

export interface NotificationItem {
    message: string;
    type: 'success'| 'error'| 'warning' | 'info';
    id: string;
    duration: number;
    isShown: boolean;
}

// creating store
const useNotificationStore  = defineStore('notificationStore', ()=>{

    const toastAlertIsOpen = ref<boolean>(false);
    const activeNotification = ref<NotificationItem[]>([])
    const notificationQueue = ref<NotificationItem[]>([])

    // getters
    const getNotification = computed((()=>activeNotification.value))
    const hasNotification = computed(()=>activeNotification.value.length > 0)
    const getActiveNotificationStackLength = computed(()=>activeNotification.value.length)
    const getNotificationStackLength = computed(()=>notificationQueue.value.length)
    const getToastAlertIsOpen = computed(()=>toastAlertIsOpen.value)

//     setters

    const setToastAlertIsOpen = (value: boolean)=>{
        toastAlertIsOpen.value = value;
    }

//     actions

    const addNotification =(message: string, type: NotificationItem['type'])=>{
        const id = uuidV4();
        notificationQueue.value.push(
            {
                message:message,
                type: type,
                id: id,
                duration: 5000,
                isShown:false
            }
        )

    }

    const removeNotification =(id: string)=>{
        const index = activeNotification .value.findIndex((notification =>notification.id = id))
        if(index){
            activeNotification.value[index].isShown =false;
            setTimeout(()=>{
                activeNotification.value.splice(index, 1)
            }, 400)
        }
    }

    const processNotificationQueue =()=>{
        if(getNotificationStackLength.value > 0 && getActiveNotificationStackLength.value < 3 ){
            const notification  = notificationQueue.value.shift() as NotificationItem;
            notification.isShown = true;
            activeNotification.value.push(notification);


            setTimeout(()=>{
                removeNotification(notification.id as string)
                processNotificationQueue()

            }, notification.duration)

        }
    }

    return {
        toastAlertIsOpen,
        activeNotification,
        notificationQueue,
        getNotification,
        hasNotification,
        getActiveNotificationStackLength,
        getNotificationStackLength,
        getToastAlertIsOpen,
        setToastAlertIsOpen,
        addNotification,
        removeNotification,
        processNotificationQueue
    }



})