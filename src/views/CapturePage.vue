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
const uniqueId = ref<string>()
const route = useRouter()

//email validation
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

// phone number validation
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

// capture image
const onCapture = (capturedImageItem: CapturedImageItem) => {
  capturedImages.value.splice(0, 1)
  capturedImages.value.push(capturedImageItem)
  console.log(capturedImages)
  takePhoto.value = false
}

// conversion of image from base64 to file
const baseToFile = ()=>{
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

// submit user details
const onSubmit = () => {
  if (emailMeta.valid && phoneNoMeta.valid && capturedImages.value.length > 0) {
    console.log('submitted')
    const customerPayload = {
      email: customerDetails.email,
      phone_number: customerDetails.phoneNo,
      image: baseToFile()
    }

    customerStore.customerSMS(customerPayload)
        .then((resp)=>{
          if(resp.message){
            console.log(resp)
            // notificationStore.addNotification('Details saved successfully', 'success')
          }
          else{
            console.log(resp)
            // notificationStore.addNotification('Error occurred try again', 'error')
          }
        })
        .catch((error: any)=>{
          console.log(error)
          // notificationStore.addNotification('Error occurred try again', 'error')
        })


    customerStore.postCustomerDetails(customerPayload)
        .then((resp)=>{
          if(resp.message){
           console.log( resp.data.unique_id)
            uniqueId.value = resp.data.unique_id
            notificationStore.addNotification('Details saved successfully', 'success')
          }
          else{
            console.log(resp)
            notificationStore.addNotification('Error occurred try again', 'error')
          }
        })
        .catch((error: any)=>{
          console.log(error)
          notificationStore.addNotification('Error occurred try again', 'error')
        })
  }
  else {
    notificationStore.addNotification('Please fill all fields', 'warning')
  }
}

// close social dialog box
const closeSocialsDialog = ()=>{
  campaignStore.closeDialogSocial()
  window.location.href = '/'
}
const socialUsername = ref('')

//social username validation
const socialUsernameValidator = (value: string)=>{
  if(!value){
    return 'Username is required'
  }
  if(value.length > 50){
    return 'Username must be less than 50 characters'
  }
  if(value.length < 3){
    return 'Username must be more than 3 characters'
  }
  return true
}

const {
  value: userName,
  meta: socialUsernameMeta,
  errorMessage: socialUsernameErrorMessage,
} = useField('socialUsername', socialUsernameValidator)

watch(()=>socialUsername.value, (value)=>{
  userName.value = value
})

const isShare = ref(false)
const social = ref('')

// change social media name and isShare state
const shareMedia=(value:string) =>{
  console.log(value);
  isShare.value = true
  social.value = value
}

async function shareNavigator(){
  const shareData = {
    files: [baseToFile()]
  }
  const isSharable = navigator.canShare(shareData)
  if(!isSharable){
    await route.push('/cannot-share-fallback')
  }
  try{
    console.log(shareData)
    await navigator.share(shareData)
  }
  catch(error){
    console.log("Error sharing", error)
    notificationStore.addNotification('Error occurred while sharing try again', 'error')

  }
}

// share with Web Share API
const shareButton = async() =>{
  if(userName.value){
    console.log(social.value)
    isShare.value = false

    const socialsPayload = {
      username: userName.value,
      socials: social.value,
      unique_id: uniqueId.value
    }
    customerStore.postUserName(socialsPayload)
        .then((resp)=>{
          try{
            if(resp.message){
              shareNavigator()
            }
            else{
              console.log(resp)
              notificationStore.addNotification('Error occurred while sharing try again', 'error')
            }
          }
          catch(error){
            console.log("Error sharing", error)
            notificationStore.addNotification('Error occurred while sharing try again', 'error')
          }
        })
  }
  else{
    notificationStore.addNotification('Please add your username', 'warning')
  }
}

</script>

<template>
  <div class="mx-3 mb-2">
  <div class="w-full flex flex-col h-full border border-red-600 rounded-lg ">
    <div class="flex  flex-row justify-center sticky top-0 bg-red-600 text-white rounded-lg">
      <div class="">
        <img src="../assets/images/mzawadi-logo.jpeg" class="h-14 w-22">
      </div>
      <div class="flex justify-center items-center ms-3">
        <h1 class="md:text-2xl font-bold lg:text-4xl">DAIRYLAND</h1>
        <span class="flex items-center text-medium ps-1 5 md:pt-1  lg:text-2xl lg:pt-2 font-semibold">CAMPAIGN</span>
      </div>
    </div>
    <div class="flex flex-col md:flex-row *:w-full h-screen md:px-2 md:justify-center justify-center">
      <div class="sm:pt-3 w-full  flex flex-col items-center justify-center">
          <img id='myImage' alt="dairyland_product" src="../assets/images/Dairyland.png" class="w-36 lg:w-96">
        <div class="flex justify-center w-80 lg:w-88">
          <p class="lg:text-normal text-center text-lg">Win different prizes including Points, Fridges etc by
            just
            taking a selfie of yourself with <span class="font-bold text-lg">DairyLand Yoghurt.</span></p>
        </div>
      </div>
      <div class="flex items-center justify-center">
        <div class="w-full grid grid-cols-1 max-w-sm">
          <div class="flex justify-center items-center">
           <div class=" border border-gray-400 bg-red-500 h-56 w-80 rounded-md flex justify-center items-center"
                v-if="takePhoto"
           >
             <div class="h-24 w-24  flex flex-col justify-center items-center bg-white rounded-md">
               <div class="flex  justify-center items-center pt-2">
                 <button  @click=" cameraModalIsOpen = ! cameraModalIsOpen">
                   <span class="material-icons-outlined !text-6xl text-red-500">photo_camera</span>
                 </button>
               </div>
               <div>
                 <p class="text-sm font-semibold">Take a photo</p>
               </div>
             </div>
           </div>

            <CapturedImage
                v-for="capturedImage in capturedImages"
                :key="capturedImage.timestamp"
                :img-data-url="capturedImage.imgDataUrl"
                :timestamp="capturedImage.timestamp"
                @delete-image = "closeSocialsDialog"
            />
          </div>
          <div class="w-full pt-3">
            <form class="max-w-sm mx-3 mb-12">
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
              <div class="pb-16">
                <button
                    v-if="campaignStore.isAppFetching"
                    class="text-white w-full bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                  <span class="loading loading-spinner loading-md"></span>
                </button>
                <button type="submit"
                        v-else
                        @click.prevent="onSubmit"
                        class="text-white w-full bg-red-500 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
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
          <div class="w-full flex justify-end">
            <button class="btn btn-sm btn-circle"
                    @click="closeSocialsDialog"
            >
              <span class="material-icons-outlined">close</span>
            </button>
          </div>
          <div>
            <h1 class="text-xl font-semibold">Share to earn more</h1>
          </div>
        </template>
        <template #body>
          <div  class="flex space-x-5 justify-center items-center h-24">
            <button
                @click ="shareMedia('Facebook')"
                :disabled="isShare"
                class="bg-blue-900 btn-circle flex items-center justify-center text-white">
              <Facebook
                  stroke-width="2"
                  :size="32"
              />
            </button>
            <button
                @click="shareMedia('Twitter')"
                class="bg-sky-400 btn-circle flex items-center justify-center text-white">
              <Twitter :size='32' />
            </button>
            <button
                @click ="shareMedia('Instagram')"
                class="bg-red-600 btn-circle flex items-center justify-center text-white">
              <Instagram  :size="32"/>
            </button>
          </div>

        </template>
        <template #footer>
          <div v-if="isShare">
            <p class="text-medium pb-2">Kindly share your {{social}} username</p>
            <div class="relative">
              <div class="absolute inset-y-0 end-3 flex items-center">
                <button
                    @click="shareButton"
                    class="bg-red-400 text-sm text-white rounded-full px-4 py-2">Share</button>
              </div>
              <input
                  class="input input-primary w-full"
                  type="text"
                  v-model="socialUsername"
                  placeholder="Enter username"
                  :class="{
                  'input-error': socialUsernameMeta.validated && !socialUsernameMeta.valid,
                  'input-primary': socialUsernameMeta.validated && socialUsernameMeta.valid
                }"
              >
            </div>
            <small v-if="socialUsernameMeta.validated && !socialUsernameMeta.valid" class="text-rose-500">{{socialUsernameErrorMessage}}</small>
          </div>
          <div v-else>
            <p class="text-neutral-500">Click one of the above socials to proceed</p>

          </div>
        </template>
      </DialogModal>
    </teleport>
  </div>
  </div>
</template>
