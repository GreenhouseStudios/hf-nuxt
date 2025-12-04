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
      eventOptions {
        postType
        cardSize
        thumbnail {
            node {
                mediaItemUrl
                sourceUrl
            }
        }
        eventYear
        teaser
        heroText
        contentQuote
        quoteSpeaker
        content
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