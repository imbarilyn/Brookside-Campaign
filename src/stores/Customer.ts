import { defineStore } from 'pinia'

import { useCampaignStore, useNotificationStore} from "@/stores";
import {computed, ref} from "vue";




export const useCustomerStore = defineStore('customerStore', () => {

//     setters
    const blur = ref<boolean>(false)
    const isBlur = computed(()=>blur.value)


//     actions
    async function postCustomerDetails(customerDetails: any) {
     const formData = new FormData()
        formData.append('email', customerDetails.email)
        formData.append('phone_number', customerDetails.phone_number)
        formData.append('image', customerDetails.image)

        const campaignStore = useCampaignStore()
        console.log(customerDetails)
        campaignStore.setIsAppFetching(true)


        try {
            const response = await fetch('https://saccoaiapi.mzawadi.com/campaigns/analyze_data', {
                method: 'POST',
                body: formData,
                mode: 'cors'
            })
            const resp = await response.json()
            return resp


        } catch (error) {
            console.log(error)
            // notification.addNotification('Unable to save photo', 'error')
        }
        finally {
            console.log('done')
            setTimeout(()=>{
                campaignStore.setIsAppFetching(false)


                // campaignStore.openDialogSocial()
                window.location.href= '/'
            }, 5000)
        }
    }

    async function postUserName (userName: any){
        const useNotification = useNotificationStore()
        const campaignStore = useCampaignStore()

        campaignStore.setIsAppFetching(true)

        try{
            const response = await fetch('', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userName),
                mode: 'cors'
            })
            const resp = await response.json()
            return resp
        }
        catch(error){
            console.log(error)
        }
        finally{
            setTimeout(()=>{
                campaignStore.setIsAppFetching(false)
                window.location.href ='/'
            }, 500)
        }
    }

    return {
        postCustomerDetails,
        postUserName,
        isBlur

    }
})