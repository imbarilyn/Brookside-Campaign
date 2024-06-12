import { defineStore } from 'pinia'

export const useCustomerStore = defineStore('customerStore', () => {


//     actions
    async function postCustomerDetails(customerDetails: any) {
        try{
        const response = await fetch('https://bots-api.mzawadi.com/api/campaigns', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                mode: 'no-cors',
            },
            body: JSON.stringify(customerDetails)
        })
        const resp = await response.json()
        console.log(resp)
            return resp
    }
    catch (error) {
        console.error(error)
        alert("An error has occurred")
    }}
    return {
        postCustomerDetails
    }



})