import { QueryClient, QueryClientProvider } from "react-query";
import JobListings from "./JobListings";

export const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <JobListings />
    </QueryClientProvider>
  );
}
