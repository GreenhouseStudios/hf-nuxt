import { gql } from "graphql-request";

export const GET_POSTS = gql`
query GetPosts {
  posts(first: 200) {
    nodes {
      content
      id
      title
      date
      slug
      link
      cardOptions {
        year
        type
        cardDescription
        quoteTagline
        quoteLink
        mainImage {
          node {
            mediaItemUrl
            sourceUrl
          }
        }
      }
      categories {
        nodes {
          slug
          description
          name
        }
      }
    }
  }
}
`;