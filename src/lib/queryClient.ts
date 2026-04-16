import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Keep data fresh — re-fetch when the window regains focus
      staleTime: 60_000,       // 30 s before considered stale
      gcTime: 5 * 60_000,      // 5 min before unused cache is GC'd
      retry: 2,
      refetchOnWindowFocus: true,
    },
  },
});
