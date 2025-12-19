import { ref, onMounted } from 'vue';


const KEY = 'hf_hasSeenHero';

export function useFirstVisit() {
  const ready = ref(false);
  const hasSeen = ref(false);

  onMounted(() => {
    if(typeof window === 'undefined') return;
    hasSeen.value = window.localStorage.getItem(KEY) === '1';
    ready.value = true;
  })

  function markSeen() {
    if(typeof window === 'undefined') return;
    window.localStorage.setItem(KEY, '1');
    hasSeen.value = true;
  }

  function resetSeen() {
    if(typeof window === 'undefined') return;
    window.localStorage.removeItem(KEY);
    hasSeen.value = false;
  }

  return { ready, hasSeen, markSeen, resetSeen }
}