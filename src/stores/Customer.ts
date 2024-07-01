import { defineStore } from 'pinia'

import { useCampaignStore, useNotificationStore} from "@/stores";




export const useCustomerStore = defineStore('customerStore', () => {

//     actions
    async function postCustomerDetails(customerDetails: any) {
        // const formData = new FormData()
        // formData.append('image', customerDetails.image)
        // formData.append('email', customerDetails.email)
        // formData.append('phoneNo', customerDetails.phone_number)
        // // formData.append('socials', customerDetails.socials)
        // // console.log(formData.get('socials'))
        // console.log(formData)
        const campaignStore = useCampaignStore()
        console.log(customerDetails)
        campaignStore.setIsAppFetching(true)


        try {
            const response = await fetch('https://bots-api.mzawadi.com/api/campaigns', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customerDetails),
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
                campaignStore.openDialogSocial()
                campaignStore.setIsAppFetching(false)
            }, 1000)
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
        postUserName

    }
})