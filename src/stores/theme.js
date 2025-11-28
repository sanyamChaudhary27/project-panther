import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDarkMode: localStorage.getItem('panther_theme') !== 'light',
  }),

  actions: {
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      localStorage.setItem('panther_theme', this.isDarkMode ? 'dark' : 'light');
      this.applyTheme();
    },

    applyTheme() {
      if (this.isDarkMode) {
        document.documentElement.style.setProperty('--text-primary', '#f5f5f5');
        document.documentElement.style.setProperty('--primary-dark', '#0a0a0a');
      } else {
        document.documentElement.style.setProperty('--text-primary', '#1a1a1a');
        document.documentElement.style.setProperty('--primary-dark', '#ffffff');
      }
    },

    initTheme() {
      this.applyTheme();
    }
  }
});