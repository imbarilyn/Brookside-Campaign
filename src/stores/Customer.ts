import { defineStore } from 'pinia'
import { useNotificationStore} from "@/stores";

const notification = useNotificationStore()

export const useCustomerStore = defineStore('customerStore', () => {

//     actions
    async function postCustomerDetails(customerDetails: any) {
        const formData = new FormData()
        formData.append('image', customerDetails.image)
        formData.append('email', customerDetails.email)
        formData.append('phone_number', customerDetails.phone_number)
        formData.append('socials', customerDetails.socials)
        console.log(formData.get('socials'))


        try {
            const response = await fetch('https://f2ee-105-163-158-195.ngrok-free.app/campaigns/analyze_data', {
                method: 'POST',
                body: formData
            })
            const resp = await response.json()
            // console.log(resp)
            // if(resp.message){
            //     // notification.addNotification('Details saved successfully', 'success')
            //     console.log(resp)
            //     return resp
            // }
            // else{
            //     console.log(resp)
            //     return resp
            //     // notification.addNotification('Error occurred while saving details', 'error')
            // }
            return resp


        } catch (error) {
            console.log(error)
            // notification.addNotification('Unable to save photo', 'error')
        }
        finally {
            console.log('done')
            setTimeout(()=>{
                // window.location.href = "/"
            }, 1000)
        }
    }

    return {
        postCustomerDetails
    }
})