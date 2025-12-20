// stores/default.js
import { defineStore } from 'pinia';
type ModalItem = Post | Influencer;
export const useStore = defineStore('store', {
    state: () => ({
        showModal: false as boolean,
        modalPost: null as ModalItem | null,
        modalType: '',
        isModalOpen: false as boolean,
        timelineFilterCategories: [] as Category[],
        searchTerm: '',
        quotesMuted: false
    }),
    actions: {
      openModal(post: Post | Influencer) {
        this.modalPost = post
        if (this.showModal) return
        this.showModal = true
        document.body.querySelector('.hf-page')?.classList.add('modal-open')
      },

      closeModal() {
        if (!this.showModal) return
        this.showModal = false
        this.modalPost = null
        document.body.querySelector('.hf-page')?.classList.remove('modal-open')
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
console.log('🟡 store initialized', performance.now())
