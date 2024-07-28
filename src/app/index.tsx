import { AuthContextProvider } from "@/contexts/auth";
import { Router } from "@/routes/routes";
import { PaperProvider } from "react-native-paper";

export default function Index() {
  return (
    <>
      <AuthContextProvider>
        <PaperProvider>
          <Router />
        </PaperProvider>
      </AuthContextProvider>
    </>
  );
}
