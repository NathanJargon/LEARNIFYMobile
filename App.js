import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import theme from "./utils/theme";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Main from "./pages/Main";
import Course from "./pages/Course";
import Quiz from "./pages/Quiz";
import PersonalInfo from "./pages/PersonalInfo";
import Security from "./pages/Security";
import Notification from "./pages/Notification";
import PDFViewer from "./pages/PDFViewer";

export default function App() {
  const Stack = createNativeStackNavigator();
  const [userIsAuthenticated, setUserIsAuthenticated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('userToken').then(userToken => {
      if (userToken) {
        setUserIsAuthenticated(true);
      }
    });
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
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="Course" component={Course} />
          <Stack.Screen name="Quiz" component={Quiz} />
          <Stack.Screen name="PersonalInfo" component={PersonalInfo} />
          <Stack.Screen name="Security" component={Security} />
          <Stack.Screen name="Notification" component={Notification} />
          <Stack.Screen name="PDFViewer" component={PDFViewer} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="dark" />
    </PaperProvider>
  );
}