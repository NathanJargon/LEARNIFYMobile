import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Home from "./Home";
import Setting from "./Setting";

export default function Main() {
  const Tab = createBottomTabNavigator();

  return (
    /* the tabBarStyle and tabBarLabelStyle is for the height customization for the bottom tab nav */
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        headerShown: false,
        tabBarStyle: {
          height: 60,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          height: 24,
        },
      }}
    >
      <Tab.Screen
        options={{
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialCommunityIcons name="home" size={size} color={color} />
            );
          },
        }}
        name="Home"
        component={Home}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialCommunityIcons
                name="nut"
                size={size}
                color={color}
              />
            );
          },
        }}
        name="Setting"
        component={Setting}
      />
    </Tab.Navigator>
  );
}
