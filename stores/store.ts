// stores/default.js
import { defineStore } from 'pinia';
export const useStore = defineStore('store', {
    state: () => ({
        showModal: false as boolean,
        modalPost: null as Post | null,
        modalType: '',
        isModalOpen: false as boolean,
        timelineFilterCategories: [] as Category[],
        searchTerm: '',
        quotesMuted: false
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
      },
      setQuotesMuted(val: boolean) {
        this.quotesMuted = val;
      },
      toggleQuotesMuted() {
        this.quotesMuted = !this.quotesMuted;
      }
    },
    getters: {
        getModalState(): boolean {
            return this.showModal;
        }
    },
});
