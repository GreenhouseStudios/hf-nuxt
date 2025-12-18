export {};
declare global {
    interface Category {
        name: string;
        description: string;
        slug: string;
    }
    
    interface Post {
        content: string;
        title: string;
        date: string;
        slug: string;
        link: string;
        eventOptions: {
            postType: string;
            cardSize: string;
            thumbnail: {
                node: {
                    mediaItemUrl: string;
                    sourceUrl: string;
                    altText: string;
                    mediaDetails: {
                        sizes: {
                            name: string;
                            sourceUrl: string;
                            width: number;
                            height: number;
                        }[];
                    };
                }
            }
            eventYear: string;
            teaser: string;
            heroText: string;
            contentVideo: string;
            contentQuote: string;
            quoteSpeaker: string;
            content:string;
            tagline: string;
            quote: string;
            speaker: string;
            speakerTitle: string;
            videoLink: string;
        };
        categories: {
            nodes: Category[];
        };
    }

    interface Influencer {
        id: string;
        title: string;
        slug: string;
        link: string;
        influencerDetails: {
          honorific: string;
          name: string;
          title: string;
          description: string;
          town: string;
          image: {
            node: {
              mediaItemUrl: string;
              sourceUrl: string;
              altText: string;
              mediaDetails: {
                sizes: {
                  name: string;
                  sourceUrl: string;
                  width: number;
                  height: number;
                }[];
              };
            };
          };
        };
      }
}
