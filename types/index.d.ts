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
        cardOptions: {
            year: string;
            type: string;
            cardDescription: string;
            quoteAuthor: string;
            mainImage: {
                node: {
                    mediaItemUrl: string;
                    sourceUrl: string;
                };
            };
        };
        eventOptions: {
            postType: string;
            cardSize: string;
            thumbnail: {
                node: {
                    mediaItemUrl: string;
                    sourceUrl: string;
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
          name: string;
          title: string;
          description: string;
          image: {
            node: {
              mediaItemUrl: string;
              sourceUrl: string;
            };
          };
        };
      }
}
