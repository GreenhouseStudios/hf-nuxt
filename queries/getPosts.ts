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
      eventOptions {
        postType
        cardSize
        eventYear
        teaser
        content
        image {
          node {
            mediaItemUrl
            sourceUrl
          }
        }
        tagline
        quote
        speaker
        speakerTitle
        videoLink
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