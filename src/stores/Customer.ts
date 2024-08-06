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
            console.log(resp)
            return resp


        } catch (error) {
            console.log(error)
            // notification.addNotification('Unable to save photo', 'error')
        }
        finally {
            console.log('done')
            setTimeout(()=>{
                campaignStore.setIsAppFetching(false)
                campaignStore.openDialogSocial()
                // window.location.href= '/'
            }, 1000)
        }
    }

    async function postUserName (userName: any){
        const useNotification = useNotificationStore()
        const campaignStore = useCampaignStore()
        console.log(userName)

        const formData = new FormData()
        formData.append('username', userName.username)
        formData.append('socials', userName.socials)
        formData.append('unique_id', userName.unique_id)
        console.log(formData)

        try{
            const response = await fetch('https://saccoaiapi.mzawadi.com/campaigns/store_socails', {
                method: 'POST',
                body: formData,
                mode: 'cors'
            })
            const resp = await response.json()
            console.log(resp)
            return resp
        }
        catch(error){
            console.log(error)
        }
        finally{
            setTimeout(()=>{
                // window.location.href ='/'
            }, 1000)
        }
    }


    async function customerSMS (customer: any){
        const msg = "Thank you for participating in the Dairyland campaigns, you have been awarded 1 point for your submission."
        try{
            const response = await fetch(`https://business.mzawadi.com/comms/wakiliSMS?mobile=${customer.phone_number}&sms=${encodeURIComponent(msg)}`, {
                method: 'GET',
                mode: 'cors'
            })
            const data = await response.json()
            console.log(data)
            return data
        }
        catch(error){
            console.log('error', error)
        }
    }

    return {
        postCustomerDetails,
        postUserName,
        isBlur,
        customerSMS

    }
})