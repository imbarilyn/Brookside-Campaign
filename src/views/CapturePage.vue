<script setup lang="ts">
import CapturedImage from "@/views/CapturedImage.vue";
import CameraModall from "@/views/CameraModall.vue";
import {reactive, ref, watch} from "vue";
import {useField} from 'vee-validate'
import {useCustomerStore} from "@/stores";

export interface CapturedImageItem {
  imgDataUrl: string
  timestamp: number
}

const customerStore = useCustomerStore()
const cameraModalIsOpen = ref(false)
const capturedImages = ref<CapturedImageItem[]>([])
const customerDetails = reactive({
  email: '',
  phoneNo: ''
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
}

const onSubmit = () => {
  if (emailMeta.valid && phoneNoMeta.valid && capturedImages.value.length > 0) {
    console.log('submitted')
    const customerPayload = {
      email: customerDetails.email,
      phoneNo: customerDetails.phoneNo,
      image: capturedImages.value[0].imgDataUrl
    }
    customerStore.postCustomerDetails(customerPayload)
        .then((customerDetail: any) => {
          console.log(customerDetail)
          alert("Details submitted successfully")
          window.location.href = '/'
        })
        .catch((error: any) => {
          console.log(error)
          alert("An error occured")
        })
  } else {
    alert("Kindly fill all required details")
  }

}
</script>

<template>
  <div class="relative min-h-screen w-full flex flex-col ">
    <div class="flex justify-center pt-10 ">

      <h1 class="md:text-2xl font-bold lg:text-4xl ">BROOKSIDE</h1>
      <span class="flex items-center text-medium ps-3 md:pt-1  lg:text-2xl lg:pt-2 font-semibold">CAMPAIGN</span>
    </div>

    <div class="flex flex-col md:flex-row *:w-full md:px-10 lg:justify-center">
      <div class=" pt-10 w-full  flex flex-col items-center justify-center">
        <div class=" w-24 w-42 lg:w-64 lg:h-80 ">
          <img alt="dairy-img" src="../assets/images/dairy.png">
        </div>
        <div class="my-3 flex justify-center w-80">
          <p class="text-md text-center leading-none lg:pt-12">Win different prizes including Points, Fridges etc by just
            taking a selfie of yourself with brookside.</p>
        </div>
      </div>
      <div class="flex items-center justify-center">

        <div class="w-full flex flex-col items-center justify-center">
          <div class="w-[300px] pt-20">
            <CapturedImage v-for="capturedImage in capturedImages" :key="capturedImage.timestamp"
                           :img-data-url="capturedImage.imgDataUrl" :timestamp="capturedImage.timestamp"
            />
          </div>
          <div class="w-full">
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
              <input type="text" id="phonenumber"
                     v-model="customerDetails.phoneNo"
                     :class="{
                    'input-error': phoneNoMeta.validated && !phoneNoMeta.valid,
                    'input-primary': phoneNoMeta.validated &&phoneNoMeta.valid
                  }"
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
              <button class="btn btn-active bg-sky-400" @click=" cameraModalIsOpen = ! cameraModalIsOpen">Take a photo
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
  </div>
</template>