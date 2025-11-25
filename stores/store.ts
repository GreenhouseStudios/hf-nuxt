// stores/default.js
import { defineStore } from 'pinia';
export const useStore = defineStore('store', {
    state: () => ({
        showModal: false as boolean,
        modalPost: null as Post | null,
        modalType: '',
        timelineFilterCategories: [] as Category[],
        searchTerm: '',
    }),
    actions: {
       toggleModal() {
              this.showModal = !this.showModal;
              const page = document.body.querySelector('.hf-page');
              console.log(page)
              if(page) page.classList.toggle('modal-open');
         }, 
        setModalPost(post: Post) {
            this.modalPost = post
            this.toggleModal()
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
