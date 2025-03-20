import { gql } from "graphql-request";

export const GET_POSTS = gql`
query GetPosts {
  posts {
    nodes {
      content
      title
      date
      slug
      link
  }
}
}
`;