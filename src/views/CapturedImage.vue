<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import moment from 'moment'
import { Trash2, X, Trash } from 'lucide-vue-next'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'

interface CapturedImageProps {
  imgDataUrl: string
  timestamp: number
}

const props = defineProps<CapturedImageProps>()

const emits = defineEmits<{
  (event: 'imageClick'): void
  (event: 'deleteImage', timestamp: number): void
}>()

const formattedTimestamp = ref('')

// when the image is clicked, show it in a modal

const isModalOpen = ref(false)

function onImageClick() {
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

function onDeletionClick() {
  closeModal()
  emits('deleteImage', props.timestamp)
}

onMounted(() => {
  formattedTimestamp.value = moment(props.timestamp).calendar(null, {
    sameDay: 'h:mm A',
    lastDay: '[Yesterday]',
    lastWeek: 'dddd',
    sameElse: 'MMM D, YYYY'
  })
})


</script>

<template>
  <div
      class="h-56 w-80 rounded-md overflow-hidden relative pb-4 cursor-pointer active:scale-95 transition-transform duration-200 ease-in-out hover:shadow-xl active:shadow-none animate-scale-up-center"
      @click="onImageClick"
  >
    <div class="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>
    <img :alt="`Captured image at ${timestamp}`" :src="imgDataUrl" class="w-full h-auto" />

    <button class="absolute top-2 right-2 z-20" @click="onDeletionClick">
      <Trash :size="20" class="text-white" />
    </button>

    <small class="absolute bottom-2 right-2 z-20 text-white text-xxs font-montserrat-medium"
    >Captured at {{ formattedTimestamp }}</small
    >

    <Teleport to="body">
      <TransitionRoot :show="isModalOpen" appear as="template">
        <Dialog as="div" class="relative z-40" @close="closeModal">
          <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100"
              leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black" />
          </TransitionChild>

          <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                  as="template"
                  enter="duration-500 ease-out"
                  enter-from="opacity-0 scale-95"
                  enter-to="opacity-100 scale-100"
                  leave="duration-200 ease-in"
                  leave-from="opacity-100 scale-100"
                  leave-to="opacity-0 scale-95"
              >
                <DialogPanel
                    class="w-full transform overflow-hidden align-middle shadow-xl transition-all"
                >
                  <!--                  <DialogTitle as="h3" class="text-white">Captured Image</DialogTitle>-->
                  <div class="mt-2">
                    <img
                        :alt="`Captured image at ${timestamp}`"
                        :src="imgDataUrl"
                        class="w-full h-auto"
                    />
                  </div>

                  <small
                      class="absolute bottom-2 left-2 z-20 text-white text-xs font-montserrat-medium"
                  >Captured at {{ formattedTimestamp }}</small
                  >

                  <div class="mt-8">
                    <button
                        class="btn btn-circle btn-outline !border-white"
                        @click="onDeletionClick"
                    >
                      <Trash2 class="text-white" />
                    </button>
                  </div>

                  <div class="absolute top-0 left-0 flex justify-center items-center p-4">
                    <button
                        id="stopCameraBtn"
                        class="btn btn-circle btn-outline !border-none normal-case text-white"
                        @click="closeModal"
                    >
                      <X :size="24" class="text-white" />
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </Teleport>
  </div>
</template>

<style scoped></style>