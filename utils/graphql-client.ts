import { GraphQLClient } from 'graphql-request'

export const createGraphqlClient = () => {
  const config = useRuntimeConfig()
  const WP_GRAPHQL_URL = config.public.graphqlUrl
  
  return new GraphQLClient(WP_GRAPHQL_URL)
}