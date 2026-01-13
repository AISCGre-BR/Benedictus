<template>
  <div class="top-bar">
    <div class="tabs">
      <button class="tab">Home</button>
      <button class="tab active">Score</button>
      <button class="tab">Publish</button>
    </div>

    <div class="tools-group">
      <button class="tool-btn not-working" title="Not implemented">
        <FileText :size="16" />
        <span>Parts</span>
      </button>
      <button class="tool-btn not-working" title="Not implemented">
        <Sliders :size="16" />
        <span>Mixer</span>
      </button>
    </div>

    <div class="playback-controls not-working" title="Not implemented">
      <button class="icon-btn"><MoreVertical :size="16" /></button>
      <button class="icon-btn"><Rewind :size="16" /></button>
      <button class="icon-btn"><Repeat :size="16" /></button>
      <button class="icon-btn"><Settings :size="16" /></button>
      <div class="time-display">0:00:00.0</div>
      <div class="measure-display">1. 1</div>
      <div class="tempo-display">♩ = 120</div>
    </div>
    
    <!-- Real Process Button (moved outside "not-working" area or just placed strategically) -->
    <!-- Let's put it next to the mixer group or at the end -->
    <div class="process-group">
      <button class="tool-btn process-btn" @click="$emit('process')" :disabled="!filename" title="Process/Compile Score">
        <Play :size="16" fill="currentColor" />
        <span>Process</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileText, Sliders, Play, Rewind, Repeat, Settings, MoreVertical } from 'lucide-vue-next';

defineProps<{
  filename?: string;
}>();

defineEmits<{
  (e: 'process'): void;
}>();
</script>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2b2b2b;
  color: #e0e0e0;
  height: 40px;
  padding: 0 10px;
  border-bottom: 1px solid #1a1a1a;
  font-size: 13px;
}

.process-group {
    margin-left: 10px;
}

.process-btn {
    background-color: #267fd9 !important; /* Active blue */
    border: 1px solid #1a5ea0 !important;
}
.process-btn:hover {
    background-color: #3b8ce0 !important;
}
.process-btn:disabled {
    background-color: #444 !important;
    border-color: #333 !important;
    color: #888 !important;
    cursor: not-allowed;
}

.tabs {
  display: flex;
  gap: 2px;
}

.tab {
  background: none;
  border: none;
  color: #aaa;
  padding: 5px 15px;
  cursor: pointer;
  border-radius: 4px 4px 0 0;
}

.tab.active {
  background-color: #404040;
  color: white;
  font-weight: 500;
}

.tools-group {
  display: flex;
  gap: 5px;
  margin-left: 20px;
}

.tool-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #3a3a3a;
  border: 1px solid #1a1a1a;
  color: #e0e0e0;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.tool-btn:hover {
  background: #4a4a4a;
}

/* Not working style */
.not-working {
  opacity: 0.7;
  background-color: rgba(255, 0, 0, 0.1) !important;
  border: 1px solid rgba(255, 0, 0, 0.3) !important;
  color: #ff6b6b !important;
  cursor: not-allowed;
}
.not-working * {
  color: #ff6b6b !important;
}

.playback-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 2px 10px;
  border-radius: 4px;
}

.icon-btn {
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  color: white;
}

.time-display, .measure-display, .tempo-display {
  font-family: monospace;
  color: #aaa;
  margin-left: 5px;
}
</style>
