<template>
  <div class="score-view-container" 
       ref="containerRef"
       @mousedown="startDrag" 
       @mousemove="onDrag" 
       @mouseup="endDrag" 
       @mouseleave="endDrag"
       @wheel.prevent="onWheel">
    <div class="canvas-area" :style="transformStyle">
      <!-- 
        NOTE: This "Paper Sheet" is essentially a container for the SVG content.
        The user interacts with this as if it were a PDF viewer (zooming, panning),
        but under the hood, we are rendering an SVG generated from LaTeX.
        We apply CSS transforms (scale, translate) to simulate the PDF viewer experience.
      -->
      <div class="sheet" :class="{ 'empty': !svgSrc }">
        <template v-if="!svgSrc">
          <div class="empty-state" @mousedown.stop>
            <h2>No Score Loaded</h2>
            <p>Enter filename to process (in current directory):</p>
            <div class="input-group">
              <input type="text" v-model="localFilename" placeholder="e.g. myscore" @keyup.enter="loadScore" />
              <button @click="loadScore" :disabled="processing">
                Load Score
              </button>
            </div>
            <p class="error" v-if="status && status.startsWith('Error')">{{ status }}</p>
            <p v-if="status && !status.startsWith('Error') && !status.startsWith('Loading') && !status.startsWith('Success') && status !== 'Loaded'" style="color: #666; font-size: 0.9em; margin-top: 5px;">{{ status }}</p>
          </div>
        </template>
        
        <template v-else>
           <div class="score-content">
             <!-- SVG Image pretending to be a PDF page -->
             <img :src="svgSrc" alt="Score" draggable="false" />
           </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

const props = defineProps<{
  zoomLevel: number;
  filename: string;
}>();

const emit = defineEmits<{
  (e: 'update:zoomLevel', value: number): void;
  (e: 'update:filename', value: string): void;
}>();

// We use a local computed for v-model binding support
const localFilename = computed({
  get: () => props.filename,
  set: (val) => emit('update:filename', val)
});

const status = ref('');
const svgSrc = ref('');
const processing = ref(false);
const containerRef = ref<HTMLElement | null>(null);

// Panning State
const isDragging = ref(false);
const panX = ref(0);
const panY = ref(0);
const startX = ref(0);
const startY = ref(0);

// Calculate transform style based on Zoom and Pan
const transformStyle = computed(() => {
  const scale = props.zoomLevel / 100;
  return {
    transform: `translate(${panX.value}px, ${panY.value}px) scale(${scale})`,
    transformOrigin: 'center center', // Scale from center
    transition: isDragging.value ? 'none' : 'transform 0.1s ease-out'
  };
});

// ... Drag/Wheel Logic ...
const startDrag = (e: MouseEvent) => {
  if (e.button !== 0) return;
  isDragging.value = true;
  startX.value = e.clientX - panX.value;
  startY.value = e.clientY - panY.value;
  if (containerRef.value) containerRef.value.style.cursor = 'grabbing';
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return;
  e.preventDefault();
  panX.value = e.clientX - startX.value;
  panY.value = e.clientY - startY.value;
};

const endDrag = () => {
  isDragging.value = false;
  if (containerRef.value) containerRef.value.style.cursor = 'grab';
};

const onWheel = (e: WheelEvent) => {
    if (e.ctrlKey) {
        const delta = -e.deltaY * 0.5; 
        const newZoom = props.zoomLevel + delta;
        emit('update:zoomLevel', newZoom);
    } else {
        panY.value -= e.deltaY;
        panX.value -= e.deltaX;
    }
};

// ACTIONS

// Load existing SVG without processing
const loadScore = async () => {
  if (!props.filename.trim()) return;
  
  status.value = 'Loading...';
  // Don't set processing=true here to avoid disabling UI, just loading state?
  // Actually, we can just check.
  
  try {
    const response = await window.electronAPI.checkFile(props.filename.trim());
    if (response.success && response.filePath) {
      const normalizedPath = response.filePath.replace(/\\/g, '/');
      svgSrc.value = `file://${normalizedPath}?t=${response.timestamp}`;
      status.value = 'Loaded';
    } else {
      // Silent fail or just message?
      // If we are just checking, maybe don't clear svgSrc if it was valid?
      // But if we want to "load" a specific new file...
      // Let's clear if not found.
      svgSrc.value = '';
      status.value = 'File not found. Click Process to generate.';
    }
  } catch (err: any) {
    status.value = `Error loading: ${err.message}`;
  }
};

// Full Compile Process
const processFile = async () => {
  if (!props.filename.trim()) return;

  status.value = 'Processing...';
  processing.value = true;
  // keep old svg visible while processing?
  // svgSrc.value = ''; 

  try {
    const response = await window.electronAPI.processFile(props.filename.trim());

    if (response.success && response.filePath) {
      const normalizedPath = response.filePath.replace(/\\/g, '/');
      svgSrc.value = `file://${normalizedPath}?t=${response.timestamp}`; 
      status.value = 'Loaded';
      
      // Reset view on new load? Maybe keep position if re-compiling same file.
      // panX.value = 0;
      // panY.value = 0;
    } else {
      status.value = `Error: ${response.error}`;
    }
  } catch (err: any) {
    status.value = `Error: ${err.message}`;
  } finally {
    processing.value = false;
  }
};

// Expose processFile for parent
defineExpose({ processFile });

</script>

<style scoped>
.score-view-container {
  background-color: #1e1e1e; /* Dark background behind the paper */
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center; /* Center initial content */
  overflow: hidden; /* Hide scrollbars, we handle pan manually */
  padding: 0;
  cursor: grab;
  position: relative;
}

.score-view-container:active {
    cursor: grabbing;
}

.canvas-area {
    /* This area gets transformed */
    display: flex;
    justify-content: center;
    align-items: center;
}

.sheet {
  background-color: white;
  width: 210mm; /* A4 width approx */
  min-height: 297mm; /* A4 height approx */
  box-shadow: 0 0 20px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  position: relative;
  /* Ensure text doesn't get selected while dragging */
  user-select: none;
}

.sheet.empty {
  justify-content: center;
  align-items: center;
  user-select: auto; /* Allow text selection in inputs */
  cursor: default;
}

.empty-state {
  text-align: center;
  color: #333;
}

.input-group {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  background-color: #267fd9;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #7faad9;
}

.error {
  color: red;
  margin-top: 10px;
}

.score-content {
  width: 100%;
  height: 100%;
  padding: 20px; /* Margins */
  box-sizing: border-box;
  pointer-events: none; /* Let clicks pass through to container for drag, unless we want interaction inside PDF */
}

img {
  width: 100%;
  height: auto;
  pointer-events: none;
}
</style>
