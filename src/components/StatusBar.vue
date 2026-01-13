<template>
  <div class="status-bar">
    <div class="left">
      <span>Workspace: Default</span>
    </div>
    <div class="right">
      <span class="status-item"><TuningFork :size="14" /> Concert pitch</span>
      <span class="status-item"><Layout :size="14" /> Page view</span>
      <span class="status-item zoom-controls">
        <button class="zoom-btn" @click="zoomOut"><ZoomOut :size="14" /></button>
        <span class="zoom-text" @click="resetZoom">{{ zoomLevel }}%</span>
        <button class="zoom-btn" @click="zoomIn"><ZoomIn :size="14" /></button>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Layout, ZoomIn, ZoomOut } from 'lucide-vue-next';

// Fallback for TuningFork if it doesn't exist in specific icon set version, 
// but assuming it works as user didn't complain. If it breaks, we can change it.
// To be safe, let's use a simpler import if TuningFork is problematic, but let's stick to plan.
import { Music2 as TuningFork } from 'lucide-vue-next'; 

const props = defineProps<{
  zoomLevel: number;
}>();

const emit = defineEmits<{
  (e: 'update:zoomLevel', value: number): void;
}>();

const zoomIn = () => {
  emit('update:zoomLevel', props.zoomLevel + 10);
};

const zoomOut = () => {
  emit('update:zoomLevel', props.zoomLevel - 10);
};

const resetZoom = () => {
  emit('update:zoomLevel', 100);
};
</script>

<style scoped>
.status-bar {
  height: 28px;
  background-color: #267fd9; /* Blue accent from screenshot */
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  font-size: 11px;
}

.right {
  display: flex;
  gap: 15px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.zoom-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
}

.zoom-btn:hover {
  background-color: rgba(255,255,255,0.2);
  border-radius: 3px;
}

.zoom-text {
  min-width: 30px;
  text-align: center;
}
</style>
