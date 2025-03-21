import { gql } from "graphql-request";

export const GET_POSTS = gql`
query GetPosts {
  posts(first: 50) {
    nodes {
      content
      title
      date
      slug
      link
      cardOptions {
        year
        type
        cardDescription
        mainImage {
          node {
            mediaItemUrl
            sourceUrl
          }
        }
      }
    }
  }
}
`;