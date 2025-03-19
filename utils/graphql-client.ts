import { GraphQLClient } from 'graphql-request'

const WP_GRAPHQL_URL = 'https://leamh.org/hartford_foundation/index.php?graphql';

export const graphqlClient = new GraphQLClient(WP_GRAPHQL_URL)