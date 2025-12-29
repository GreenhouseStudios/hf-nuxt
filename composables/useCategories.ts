  import { createGraphqlClient } from '~/utils/graphql-client'
import { GET_CATEGORIES } from '~/queries/getCategories'
import { useQuery } from '@tanstack/vue-query'

const fetchCategories = async (): Promise<Category[]> => {
  const graphqlClient = createGraphqlClient()
  const data = await graphqlClient.request<{ categories: { nodes: Category[] } }>(GET_CATEGORIES)
  return data.categories.nodes
}

export const useCategories = () => {
  return useQuery<Category []>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })
}