<script setup lang="ts">
import {ref} from "vue";

const video = ref<HTMLVideoElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const errorMessage = ref<string | null>(null);

const width =640;
let height = 0;

// communicate with user camera
navigator.mediaDevices.getUserMedia({video: true, audio:false})
  .then(stream => {
    video.value!.srcObject = stream;
    video.value!.play();
  })
  .catch(err => {
    errorMessage.value = err.message;
  });

// for rear camera
navigator.mediaDevices.getUserMedia(
    {
      video:{
        facingMode:{
          exact: 'environment'
        }
      },
      audio:false
    }
).then(stream => {
  video.value!.srcObject = stream;
  video.value!.play();
}).catch(err => {
  errorMessage.value = err.message;
});

console.log('video', video.value);
// setting camera size
video.value!.addEventListener('canplay', () => {
  height = video.value!.videoHeight / (video.value!.videoWidth / width);
  video.value!.setAttribute('width', width.toString());
  video.value!.setAttribute('height', height.toString());
  canvas.value!.setAttribute('width', width.toString());
  canvas.value!.setAttribute('height', height.toString());
}, false);

const capture = ()=>{
  const context = canvas.value!.getContext('2d');
  if (width && height && context){
    canvas.value!.width = width;
    canvas.value!.height = height;
    context.drawImage(video.value!, 0, 0, width, height);

    const imgUrl = canvas.value!.toDataURL('image/png');
    const img = document.getElementById('photo') as HTMLImageElement;
    img.src = imgUrl;
  }


}





</script>


<template>
  <div class="min-h-screen bg-neutral-100 pt-8">
<!--    Header-->
    <div class="flex justify-center">
      <h1 class="lg:text-6xl font-bold sm:text-4xl">NIVEA SKIN CARE</h1>
      <h1 class="ps-4 lg:text-4xl sm:text-2xl flex  items-center pt-2">CAMPAIGN</h1>
    </div>
<!--    main content-->
    <div class="flex justify-center gap-6 mt-12 mx-12">
<!--      left side details-->
      <div class="relative w-80 ">
        <div class="w-80">
          <img src="../assets/images/makeup.jpg" >
        </div>
        <div class="my-3">
          <p class="text-md text-center leading-none">Win different prizes including Points, Fridges etc by just taking a selffie of yourself using our product.</p>
          <p class="text-center pt-3">You win more by sharing, smilling and enjoying yourself.</p>
          <p class="text-center">Win while you still have fun</p>
        </div>
      </div>
<!--      capture image-->
      <div>
        <div>
        <video ref="video" playsinline autoplay></video>
          <button class="btn btn-active" @click="capture"></button>        </div>
      </div>
      <canvas></canvas>
      <div>
        <img>
      </div>
    </div>

  </div>
</template>