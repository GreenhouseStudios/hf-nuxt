import { graphqlClient } from '~/utils/graphql-client';
import { GET_INFLUENCERS } from '~/queries/getInfluencers';
import { useQuery } from '@tanstack/vue-query';

const fetchInfluencers = async (): Promise<Influencer[]> => {
  const data = await graphqlClient.request<{ influencers: { nodes: Influencer[] } }>(GET_INFLUENCERS);
  return data.influencers.nodes;
};

export const useInfluencers = () => {
  return useQuery({
    queryKey: ['influencers'],
    queryFn: fetchInfluencers,
  });
};
