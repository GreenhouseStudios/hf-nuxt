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
            mainImage: {
                node: {
                    mediaItemUrl: string;
                    sourceUrl: string;
                };
            };
        };
        categories: {
            nodes: Category[];
        };
    }
}
