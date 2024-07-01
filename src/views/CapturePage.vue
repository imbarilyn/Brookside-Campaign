<script setup lang="ts">
import CapturedImage from "@/views/CapturedImage.vue";
import CameraModall from "@/views/CameraModall.vue";
import {reactive, ref, watch} from "vue";
import {useField} from 'vee-validate'
import {useCustomerStore, useNotificationStore, useCampaignStore} from "@/stores";
import NotificationContainer from "@/views/toasts/NotificationContainer.vue";
import ToastAlert from "@/views/toasts/ToastAlert.vue";
import DialogModal from "@/views/modal/DialogModal.vue";
import { Facebook, Twitter, Instagram} from 'lucide-vue-next'
import {useRouter} from "vue-router";

export interface CapturedImageItem {
  imgDataUrl: string
  timestamp: number
}
const notificationStore = useNotificationStore()
const campaignStore = useCampaignStore()

const customerStore = useCustomerStore()
const cameraModalIsOpen = ref(false)
const capturedImages = ref<CapturedImageItem[]>([])
const customerDetails = reactive({
  email: '',
  phoneNo: ''
})
const takePhoto = ref(true)
const route = useRouter()


const toggleUsername = ref<boolean>(false)

const usernameDetail = reactive({
  social1: '',
  social2: '',
})


watch(()=> usernameDetail.social1, (value)=>{
  usernameDetail.social1 = value
})

watch(()=> usernameDetail.social2, (value)=>{
  usernameDetail.social2 = value
})


const emailValidator = (value: string) => {
  if (!value) {
    return 'Email is required'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(value)) {
    return 'Email must be valid'
  }

  if (value.length > 50) {
    return 'Email must be less than 50 characters'
  }

  return true
}

const {
  value: email,
  errorMessage: emailErrorMessage,
  meta: emailMeta
} = useField('email', emailValidator)

watch(
    () => customerDetails.email,
    (value) => {
      email.value = value
    }
)

const phoneNoValidator = (value: string) => {
  if (!value) {
    return 'Phone number is required'
  }
  const phoneRegExp = /^(\+?07|01)?[0-9]\d{7}$/
  if (!phoneRegExp.test(value)) {
    return 'Phone number must be ten digits without special characters'
  }
  return true
}

const {
  value: phoneNo,
  errorMessage: phoneNoErrorMessage,
  meta: phoneNoMeta
} = useField('phoneNo', phoneNoValidator)

watch(
    () => customerDetails.phoneNo,
    (value) => {
      phoneNo.value = value
    }
)

const onCapture = (capturedImageItem: CapturedImageItem) => {
  capturedImages.value.splice(0, 1)
  capturedImages.value.push(capturedImageItem)
  console.log(capturedImages)
  takePhoto.value = false
}

const urltoFile = ()=>{
  const base64 = capturedImages.value[0].imgDataUrl
  const filename = 'image.jpg'
  const mimeType = 'image/jpeg'
  const byteString = atob(base64.split(',')[1])
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  const newBlob = new Blob([ab], {type: mimeType})
  const file = new File([newBlob], filename, {type: mimeType})
  console.log(file)
  return file
}

const onSubmit = () => {
  if (emailMeta.valid && phoneNoMeta.valid && capturedImages.value.length > 0) {
    campaignStore.openDialogSocial()
    console.log('submitted')
  }
  else {
    notificationStore.addNotification('Please fill all fields', 'warning')
  }
}
const clickCount = ref(0)
const addMoreSocials = ()=> {
  if(clickCount.value < 1 && usernameDetail.social1){
    clickCount.value++
    toggleUsername.value = true
    console.log('social1', usernameDetail.social1)
  }
  else{
    console.log("no adding more socials")
    notificationStore.addNotification('Please fill the above field first', 'warning')
    console.log(notificationStore.hasNotification)
    console.log(notificationStore.activeNotification)
    console.log(notificationStore.getNotification[0])
  }
}

const shareToSocials = ()=>{
  if(usernameDetail.social1 ||  usernameDetail.social2){
    console.log(usernameDetail)
    const socialsArray = [usernameDetail.social1, usernameDetail.social2]
    const customerPayload = {
      email: customerDetails.email,
      phone_number: customerDetails.phoneNo,
      image: urltoFile(),
      socials: socialsArray
    }
    console.log(customerPayload.socials)
    customerStore.postCustomerDetails(customerPayload)
        .then((customerDetail: any) => {
          if(customerDetail.message){
            notificationStore.addNotification('Details saved successfully', 'success')
          }
          else{
            notificationStore.addNotification('Error occurred while saving details', 'error')
          }
        })
        .catch((error: any) => {
          console.log(error)
          // notificationStore.addNotification('Error occurred', 'error')
        })
  }
  else {
    notificationStore.addNotification('Please fill all fields', 'warning')
  }

  console.log("share")
}

const closeDialog = ()=>{
  campaignStore.closeDialogSocial()
  const customerPayload = {
    email: customerDetails.email,
    phone_number: customerDetails.phoneNo,
    image: urltoFile(),
    socials: []
  }
  customerStore.postCustomerDetails(customerPayload)
      .then((resp)=>{
        console.log(resp)
        notificationStore.addNotification('Details saved successfully', 'success')
      })
      .catch((error: any)=>{
        console.log(error)
        notificationStore.addNotification('Error occurred', 'error')
      })

}
</script>

<template>
  <div class="relative min-h-screen w-full flex flex-col">
    <div class="flex justify-center pt-6 sticky top-0">
      <h1 class="md:text-2xl font-bold lg:text-4xl">BROOKSIDE</h1>
      <span class="flex items-center text-medium ps-3 md:pt-1  lg:text-2xl lg:pt-2 font-semibold">CAMPAIGN</span>
    </div>

    <div class="flex flex-col md:flex-row *:w-full md:px-10 lg:justify-center">
      <div class="w-full  flex flex-col items-center justify-center">
        <div class=" w-40 w-42 lg:w-64 lg:h-80 ">
          <img alt="dairy-img" src="../assets/images/dairy.png">
        </div>
        <div class="my-3 flex justify-center w-80">
          <p class="text-md text-center leading-none lg:pt-12">Win different prizes including Points, Fridges etc by
            just
            taking a selfie of yourself with brookside.</p>
        </div>
      </div>
      <div class="flex items-center justify-center">

        <div class="w-full grid grid-cols-1 max-w-sm">
          <div class="pt-4 flex justify-center items-center">
           <div class="border border-gray-400 bg-sky-500 h-56 w-80 rounded-md flex justify-center items-center"
                v-if="takePhoto"
           >
             <div class="h-24 w-24  flex justify-center items-center bg-white rounded-md">
               <button  @click=" cameraModalIsOpen = ! cameraModalIsOpen">
                 <span class="material-icons-outlined !text-6xl text-sky-500">photo_camera</span>
               </button>
             </div>
           </div>

            <CapturedImage
                v-for="capturedImage in capturedImages"
                :key="capturedImage.timestamp"
                :img-data-url="capturedImage.imgDataUrl"
                :timestamp="capturedImage.timestamp"
            />
          </div>
          <div class="w-full pt-3">
            <form class="max-w-sm mx-3">
              <div class="mb-5">
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white  ">Your
                  email</label>
                <input type="email" id="email"
                       v-model="customerDetails.email"
                       :class="{
                    'input-error': emailMeta.validated && !emailMeta.valid,
                    'input-primary': emailMeta.validated && emailMeta.valid
                  }"
                       class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-4 focus:outline-none focus:ring-sky-200 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                       placeholder="johndoe@gmail.com" required/>
                <small v-if="emailMeta.validated && !emailMeta.valid"
                       class="text-rose-500">{{ emailErrorMessage }}</small>
              </div>
              <div class="mb-5">
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                  Phone number</label>
                <input type="text" id="phone number"
                       v-model="customerDetails.phoneNo"

                       class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-4 focus:outline-none focus:ring-sky-200 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                       required/>
                <small v-if="phoneNoMeta.validated && !phoneNoMeta.valid"
                       class="text-rose-500">{{ phoneNoErrorMessage }}</small>
              </div>
              <div class="flex justify-between">
                <button type="submit"
                        @click.prevent="onSubmit"
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm md:w-24 px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Submit
                </button>
              </div>
            </form>
          </div>

        </div>
        <CameraModall :is-open="cameraModalIsOpen" :img-count="capturedImages.length"
                      @close-modal="cameraModalIsOpen = false" @capture-image="onCapture"
                      class="w-80"
        />
      </div>
    </div>
    <teleport to="body">
      <NotificationContainer v-if="notificationStore.hasNotification">
        <template v-for="notification in notificationStore.getNotification" :key="notification.id">
          <ToastAlert
              v-if="notification.id && notification.isShown"
              :id="notification.id"
              :duration="notification.duration"
              :is-shown="notification.isShown"
              :message="notification.message"
              :type="notification.type">
          </ToastAlert>
        </template>

      </NotificationContainer>

      <DialogModal :is-open="campaignStore.dialogSocial.isOpen">
        <template #title>
          <div class='flex justify-end'>
            <button class="btn btn-sm bg-sky-200"  @click='addMoreSocials' :disabled="clickCount === 1">
              <span class="material-icons-outlined">add</span>
              <span>Add Socials</span>
            </button>

          </div>


        </template>
        <template #body>
          <div>
            <h1 class="text-xl font-semibold">Post to your socials to earn more</h1>
          </div>

          <div class="space-y-2">
            <input class="input input-primary w-full border-sky-300 border-2 focus:outline-none focus:ring-4 focus:ring-sky-500"
                   ref="inputRefs"
                   placeholder="Add username"
                   v-model = "usernameDetail.social1"
            >
            <input class="input input-primary w-full border-sky-300 border-2 focus:outline-none focus:ring-4 focus:ring-sky-500"
                   ref="inputRefs"
                   v-if="toggleUsername"
                   placeholder="Add username"
                   v-model="usernameDetail.social2"
            >
          </div>

        </template>
        <template #footer>
          <div class="flex justify-between">
            <button class="btn bg-sky-400 hover:bg-sky-200"

                    @click = "shareToSocials">
              <span class="material-icons-outlined">share</span>
              <span>Share</span>
            </button>
            <button class="btn bg-sky-400 hover:bg-sky-200" @click = "closeDialog">close</button>
          </div>

        </template>
      </DialogModal>
    </teleport>
  </div>
</template>
