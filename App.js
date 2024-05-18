import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { Text } from "react-native-paper";

import theme from "./utils/theme";
import useStore from "./hooks/useStore";
import { getSecureStore } from "./utils/SecureStore";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Main from "./pages/Main";
import Course from "./pages/Course";
import Quiz from "./pages/Quiz";
import PersonalInfo from "./pages/PersonalInfo";
import Security from "./pages/Security";
import Notification from "./pages/Notification";

export default function App() {
  const Stack = createNativeStackNavigator();
  const userIsAuthenticated = useStore((state) => state.userIsAuthenticated);
  const signIn = useStore((state) => state.signIn);

  //if token exist then signIn user
  useEffect(() => {
    const userToken = getSecureStore("userToken");
    if (userToken) {
      signIn(userToken);
    }
  }, []);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: "fade",
          }}
        >
          {/* Protected route: Only authenticated user or user that has token
          can access this pages */}
          {userIsAuthenticated ? (
            <>
              <Stack.Screen name="Main" component={Main} />
              <Stack.Screen name="Course" component={Course} />
              <Stack.Screen name="Quiz" component={Quiz} />
              <Stack.Screen name="PersonalInfo" component={PersonalInfo} />
              <Stack.Screen name="Security" component={Security} />
              <Stack.Screen name="Notification" component={Notification} />
            </>
          ) : (
            <>
              {/* This pages will show up if user is not authenticated */}
              <Stack.Screen
                name="Login"
                options={{ headerShown: false }}
                component={Login}
              />
              <Stack.Screen
                name="Signup"
                options={{ headerShown: false }}
                component={Signup}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>

      <StatusBar style="dark" />
    </PaperProvider>
  );
}
