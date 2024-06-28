import { defineStore }  from "pinia";
import {computed, ref} from "vue";

export const  useCampaignStore   =  defineStore('campaignStore', ()=>{
    const isAppFetching = ref<boolean>(false);

    const getIsAppFetching = computed(()=>isAppFetching.value)

    const setIsAppFetching =(value: boolean) =>{
        isAppFetching.value = value;
    }


    const dialogSocial = ref({
        isOpen: false
    })

    const openDialogSocial = ()=>{
        dialogSocial.value.isOpen = true
    }

    const closeDialogSocial = ()=>{
        dialogSocial.value.isOpen = false

    }

    return {
        dialogSocial,
        openDialogSocial,
        closeDialogSocial,
        isAppFetching,
        getIsAppFetching,
        setIsAppFetching

    }
})