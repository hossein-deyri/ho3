import {
  useMutation,
  useQuery,
  QueryClient,
  useQueryClient,
} from "@tanstack/react-query";
import { PartyIndividualServices } from "./api";

const service = new PartyIndividualServices();

export const useGetIndividualParty = (params?: any) => {
  return useQuery({
    queryKey: ["party", "individual"],
    queryFn: async () => {
      const data = await service.getList(params);
      return data;
    },
  });
};

export const useGetIndividualPartyById = (id:string) => {
  return useQuery({
    queryKey: ["party", "individual"],
    queryFn: async () => {
      const data = await service.getById(id);
      return data;
    },
  });
};

export const uesAddIndividualParty = () => {
  // const { refetch } = useGetIndividualParty();

  return useMutation({
    mutationFn: async (value: any) => {
      const data = await service.create(value);
      return data;
    },
    onSuccess: (res) => {
      // refetch();
    },
  });
};

export const uesDeleteIndividualParty = (args: any = {}) => {
  const { refetch } = useGetIndividualParty({});
  return useMutation({
    mutationFn: async (id: string) => {
      const data = await service.delete(id);
      return data;
    },
    ...args,
    onSuccess: () => {
      refetch();
    },
  });
};
