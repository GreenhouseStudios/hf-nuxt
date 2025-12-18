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
                altText
                mediaItemUrl
                sourceUrl
                mediaDetails {
                  sizes {
                    name
                    sourceUrl
                    width
                    height
                  }
                }
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
        quoteYear
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