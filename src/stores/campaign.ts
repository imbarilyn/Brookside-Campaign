import { defineStore }  from "pinia";
import {ref} from "vue";

export const  useCampaignStore   =  defineStore('campaignStore', ()=>{
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
        closeDialogSocial
    }
})