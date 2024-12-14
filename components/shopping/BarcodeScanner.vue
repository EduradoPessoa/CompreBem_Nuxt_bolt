<template>
  <div class="relative">
    <video
      ref="videoRef"
      class="w-full aspect-video rounded-lg bg-black"
      :class="{ 'hidden': !isScanning }"
    />
    
    <Button
      v-if="!isScanning"
      variant="primary"
      class="w-full"
      @click="startScanning"
    >
      {{ $t('scanner.start') }}
    </Button>
    
    <Button
      v-else
      variant="secondary"
      class="w-full mt-2"
      @click="stopScanning"
    >
      {{ $t('scanner.stop') }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import { BrowserMultiFormatReader } from '@zxing/library'

const emit = defineEmits<{
  scan: [barcode: string]
}>()

const videoRef = ref<HTMLVideoElement>()
const isScanning = ref(false)
const codeReader = new BrowserMultiFormatReader()

const startScanning = async () => {
  try {
    const constraints = {
      video: { facingMode: 'environment' }
    }
    
    isScanning.value = true
    
    if (videoRef.value) {
      await codeReader.decodeFromConstraints(
        constraints,
        videoRef.value,
        (result, error) => {
          if (result) {
            emit('scan', result.getText())
            stopScanning()
          }
        }
      )
    }
  } catch (error) {
    console.error('Failed to start scanner:', error)
  }
}

const stopScanning = () => {
  codeReader.reset()
  isScanning.value = false
}

onUnmounted(() => {
  stopScanning()
})
</script>