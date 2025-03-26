import { QueryClient } from '@tanstack/vue-query'

export default defineNuxtPlugin(() => {
  const queryClient = new QueryClient()
  return {
    provide: {
      queryClient,
    },
  }
})
