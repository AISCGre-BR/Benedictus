<template>
  <div class="app-container">
    <TopBar :filename="filename" @process="triggerProcess" />
    <NoteToolbar />
    
    <div class="main-workspace">
      <Sidebar />
      <ScoreView 
        :zoom-level="zoomLevel" 
        @update:zoom-level="updateZoom" 
        v-model:filename="filename"
        ref="scoreViewRef"
      />
    </div>

    <StatusBar :zoom-level="zoomLevel" @update:zoom-level="updateZoom" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TopBar from './components/TopBar.vue';
import NoteToolbar from './components/NoteToolbar.vue';
import Sidebar from './components/Sidebar.vue';
import ScoreView from './components/ScoreView.vue';
import StatusBar from './components/StatusBar.vue';
import { useKeybindings } from './composables/useKeybindings';

const zoomLevel = ref(100);
const filename = ref('');
const scoreViewRef = ref<InstanceType<typeof ScoreView> | null>(null);

const updateZoom = (newZoom: number) => {
  if (newZoom < 10) newZoom = 10;
  if (newZoom > 500) newZoom = 500;
  zoomLevel.value = newZoom;
};

const triggerProcess = () => {
  if (scoreViewRef.value) {
    scoreViewRef.value.processFile();
  }
};

// Keybindings
useKeybindings([
  {
    key: ['=', '+'], 
    ctrl: true, 
    description: 'Zoom In',
    action: () => updateZoom(zoomLevel.value + 10)
  },
  {
    key: ['-', '_'], 
    ctrl: true, 
    description: 'Zoom Out',
    action: () => updateZoom(zoomLevel.value - 10)
  },
  {
    key: '0', 
    ctrl: true, 
    description: 'Reset Zoom',
    action: () => updateZoom(100)
  }
]);
</script>

<style>
/* Global resets */
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  overflow: hidden; /* App container handles scroll */
  background-color: #1e1e1e;
}

#app {
  height: 100vh;
  width: 100vw;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.main-workspace {
  display: flex;
  flex: 1;
  overflow: hidden;
}
</style>