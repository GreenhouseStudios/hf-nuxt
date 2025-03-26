// stores/default.js
import { defineStore } from 'pinia';

export const useStore = defineStore('store', {
    state: () => ({
        showModal: false as boolean,
        modalPost: {
            content: '',
        },
        modalType: '',
        timelineFilterCategories: [] as Category[],
    }),
    actions: {
       toggleModal() {
              this.showModal = !this.showModal;
         }, 
        setModalPost(post: Post) {
            this.modalPost = post;
            this.toggleModal();
        },
        setFilterCategories(categories: Category[]) {
            this.timelineFilterCategories = categories;
        }
    },
    getters: {
        getModalState(): boolean {
            return this.showModal;
        }
    },
});
