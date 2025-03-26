import { graphqlClient } from '~/utils/graphql-client'
import { GET_POSTS } from '~/queries/getPosts'

const fetchPosts = async (): Promise<Post []> => {
  const posts = await graphqlClient.request<{ posts: { nodes: Post[] } }>(GET_POSTS)
  return posts.posts.nodes
}

export const usePosts = () => {
    return useQuery({
      queryKey: ['posts'],
      queryFn: fetchPosts,
    })
  }