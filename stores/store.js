// stores/default.js
import { defineStore } from 'pinia';

export const useStore = defineStore('store', {
    state: () => ({
        showModal: false,
        modalPost: {
            content: '',
        },
        modalType: '',
    }),
    actions: {
       toggleModal() {
              this.showModal = !this.showModal;
         }, 
        setModalPost(post) {
            this.modalPost = post;
            this.toggleModal();
        }

    },
    getters: {
        getModalState() {
            return this.showModal;
        }
    },
});
