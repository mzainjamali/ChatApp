import { Stack } from "expo-router";
import { UserProvider } from "../context/UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="chat/[id]"
          options={{
            title: "Chat",
            headerStyle: { backgroundColor: "#075E54" },
            headerTintColor: "#fff",
          }}
        />
      </Stack>
    </UserProvider>
  );
}