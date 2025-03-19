// stores/default.js
import { defineStore } from 'pinia';

export const useStore = defineStore('store', {
    state: () => ({
        showModal: false,
    }),
    actions: {
       toggleModal() {
              this.showModal = !this.showModal;
         }, 
    },
    getters: {
        getModalState() {
            return this.showModal;
        }
    },
});
