import { graphqlClient } from '~/utils/graphql-client'
import { GET_POSTS } from '~/queries/getPosts'

const fetchPosts = async () => {
  return await graphqlClient.request(GET_POSTS)
}

export const usePosts = () => {
    return useQuery({
      queryKey: ['posts'],
      queryFn: fetchPosts,
      select: (data) => data.posts.nodes
    })
  }