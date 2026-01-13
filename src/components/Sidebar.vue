<template>
  <div class="sidebar not-working" title="Not implemented">
    <div class="sidebar-tabs">
      <button class="tab active">Palettes</button>
      <button class="tab">Instruments</button>
      <button class="tab">Properties</button>
    </div>

    <div class="search-bar">
      <Search :size="14" class="search-icon"/>
      <input type="text" placeholder="Search" disabled />
    </div>

    <div class="palettes-list">
      <div v-for="category in categories" :key="category" class="palette-item">
        <ChevronRight :size="14" />
        <span>{{ category }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Search, ChevronRight } from 'lucide-vue-next';

const categories = ref([
  'Clefs',
  'Key signatures',
  'Time signatures',
  'Tempo',
  'Pitch',
  'Accidentals',
  'Dynamics',
  'Articulations',
  'Text',
  'Keyboard',
  'Repeats & jumps',
  'Barlines',
  'Layout',
]);
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #2b2b2b;
  color: #ddd;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #1a1a1a;
  height: 100%;
}

.not-working {
  position: relative;
  /* Red tint overlay effect */
  background-color: #2b2b2b;
}

.not-working::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 0, 0, 0.1);
  pointer-events: all; /* Block clicks */
  cursor: not-allowed;
  z-index: 10;
}

.sidebar-tabs {
  display: flex;
  background-color: #222;
  border-bottom: 1px solid #1a1a1a;
}

.tab {
  flex: 1;
  background: none;
  border: none;
  color: #888;
  padding: 8px;
  font-size: 12px;
  cursor: pointer;
  text-align: center;
}

.tab.active {
  color: #e0e0e0;
  font-weight: bold;
  border-bottom: 2px solid #267fd9;
}

.search-bar {
  padding: 8px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  color: #666;
}

.search-bar input {
  width: 100%;
  padding: 6px 6px 6px 30px;
  border-radius: 4px;
  border: 1px solid #444;
  background-color: #333;
  color: white;
  font-size: 12px;
}

.palettes-list {
  flex: 1;
  overflow-y: auto;
  padding: 5px 0;
}

.palette-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  cursor: pointer;
  font-size: 13px;
  color: #ccc;
}

.palette-item:hover {
  background-color: #3a3a3a;
  color: white;
}
</style>
