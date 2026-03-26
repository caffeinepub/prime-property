import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export interface Property {
  id: bigint;
  title: string;
  description: string;
  price: string;
  location: string;
  propertyType: string;
  imageUrl: string;
  createdAt: bigint;
}

export function useGetAllProperties() {
  const { actor, isFetching } = useActor();
  return useQuery<Property[]>({
    queryKey: ["properties"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getAllProperties() as Promise<Property[]>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddProperty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      price: string;
      location: string;
      propertyType: string;
      imageUrl: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).addProperty(
        data.title,
        data.description,
        data.price,
        data.location,
        data.propertyType,
        data.imageUrl,
      ) as Promise<bigint>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
}

export function useRemoveProperty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).removeProperty(id) as Promise<void>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
}
