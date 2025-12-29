import { createGraphqlClient } from '~/utils/graphql-client'
import { GET_POSTS } from '~/queries/getPosts'
import { useQuery } from '@tanstack/vue-query'
export const fetchPosts = async (): Promise<Post []> => {
  const graphqlClient = createGraphqlClient()
  const posts = await graphqlClient.request<{ posts: { nodes: Post[] } }>(GET_POSTS)
  return posts.posts.nodes
}

export const usePosts = () => {
    return useQuery({
      queryKey: ['posts'],
      queryFn: fetchPosts,
    })
  }