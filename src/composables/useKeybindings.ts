import { onMounted, onUnmounted } from 'vue';

export interface KeyBinding {
  key: string | string[]; // Allow multiple keys for same action (e.g. ['=', '+'])
  ctrl?: boolean; // Matches Ctrl (Windows/Linux) or Command (Mac)
  shift?: boolean;
  alt?: boolean;
  description?: string; // For future UI display of shortcuts
  action: (e: KeyboardEvent) => void;
  preventDefault?: boolean;
}

/**
 * A composable to manage global keybindings.
 * 
 * Usage:
 * useKeybindings([
 *   { key: 's', ctrl: true, action: () => save(), description: 'Save' }
 * ])
 */
export function useKeybindings(bindings: KeyBinding[]) {
  const handleKeydown = (e: KeyboardEvent) => {
    // Check if we are in an input field, usually we don't want to trigger global shortcuts (like backspace)
    // unless it's a function key or specific modifier combo.
    const target = e.target as HTMLElement;
    const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

    for (const binding of bindings) {
        // If it's a simple key without modifiers, skip if in input (e.g. pressing 'a')
        // If it has modifiers (Ctrl/Alt), usually we allow it even in inputs (e.g. Ctrl+S), 
        // but text editing shortcuts (Ctrl+C) might conflict. 
        // For Zoom (Ctrl +/-), we want it always.
        
        const keys = Array.isArray(binding.key) ? binding.key : [binding.key];
        const keyMatch = keys.some(k => k.toLowerCase() === e.key.toLowerCase());

        const ctrlMatch = !!binding.ctrl === (e.ctrlKey || e.metaKey);
        const shiftMatch = !!binding.shift === e.shiftKey;
        const altMatch = !!binding.alt === e.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
            if (binding.preventDefault !== false) { // Default to true if undefined
                e.preventDefault();
            }
            binding.action(e);
            return; // Stop after first match? Or allow bubbling? Usually one action per keystroke.
        }
    }
  };

  onMounted(() => window.addEventListener('keydown', handleKeydown));
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown));
}
