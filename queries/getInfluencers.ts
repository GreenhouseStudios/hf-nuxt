import { gql } from "graphql-request";

export const GET_INFLUENCERS = gql`
  query GetInfluencers {
    influencers(first: 200) {
      nodes {
        id
        title
        slug
        link
        influencerDetails {
          name
          title
          town
          description
          image {
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
