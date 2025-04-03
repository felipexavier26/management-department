import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DepartmentPage from "./pages/DepartmentPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DepartmentPage />
    </QueryClientProvider>
  );
}

export default App;
