import { gql } from "graphql-request";

export const GET_POSTS = gql`
query GetPosts {
  posts(first: 50) {
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
        quoteAuthor
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