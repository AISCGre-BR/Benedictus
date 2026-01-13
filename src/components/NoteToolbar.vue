<template>
  <div class="note-toolbar">
    <div class="group">
      <button class="tool-icon"><PenTool :size="18" /></button>
    </div>
    
    <div class="separator"></div>
    
    <div class="group">
      <button class="tool-icon"><Music :size="18" /></button>
      <!-- Simulating note values with text or available icons for now -->
      <button class="tool-icon note-val">𝅝</button>
      <button class="tool-icon note-val">𝅗𝅥</button>
      <button class="tool-icon note-val active">𝅘𝅥</button>
      <button class="tool-icon note-val">𝅘𝅥𝅮</button>
      <button class="tool-icon note-val">𝅘𝅥𝅯</button>
    </div>

    <div class="separator"></div>

    <div class="group">
      <button class="tool-icon">♭</button>
      <button class="tool-icon">♮</button>
      <button class="tool-icon">♯</button>
    </div>

    <div class="separator"></div>
    
    <div class="group">
      <button class="tool-icon">.</button>
      <button class="tool-icon">Tie</button>
      <button class="tool-icon">Rest</button>
    </div>

    <div class="spacer"></div>

    <div class="group right-tools">
        <button class="tool-icon">Voices 1 2 3 4</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PenTool, Music } from 'lucide-vue-next';
</script>

<style scoped>
.note-toolbar {
  display: flex;
  align-items: center;
  background-color: #333;
  padding: 5px 10px;
  height: 40px;
  border-bottom: 1px solid #1a1a1a;
  color: #ddd;
}

.group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.separator {
  width: 1px;
  height: 24px;
  background-color: #555;
  margin: 0 10px;
}

.tool-icon {
  background: none;
  border: none;
  color: #bbb;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
}

.tool-icon:hover {
  background-color: #4a4a4a;
  color: white;
}

.tool-icon.active {
  background-color: #267fd9;
  color: white;
}

.note-val {
  font-size: 20px;
}

.spacer {
  flex-grow: 1;
}

.right-tools {
    font-size: 12px;
}
</style>
