import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { UserProvider, UserContext } from "./UserContext";
import OnboardingScreen from "./screens/OnboardingScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import MapScreen from "./screens/MapScreen";
import NewPinScreen from "./screens/NewPinScreen";
import ProfileScreen from "./screens/ProfileScreen";
import HomeScreen from "./screens/HomeScreen";
import JobsScreen from "./screens/JobsScreen";
import JobDetailScreen from "./screens/JobDetailScreen";
import HaulerDashboardScreen from "./screens/HaulerDashboardScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 14,
          left: 16,
          right: 16,
          elevation: 10,
          backgroundColor: "#ffffff",
          borderRadius: 32,
          height: 72,
          paddingTop: 10,
          paddingBottom: 10,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 10 },
          borderTopWidth: 0,
        },
        tabBarItemStyle: {
          borderRadius: 22,
          marginHorizontal: 6,
          marginVertical: 4,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          letterSpacing: 0.25,
        },
        tabBarActiveTintColor: "#2f6ef4",
        tabBarInactiveTintColor: "#7b7b7b",
        tabBarActiveBackgroundColor: "rgba(47, 110, 244, 0.08)",
        tabBarInactiveBackgroundColor: "#ffffff",
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Explore") {
            iconName = "search";
          } else if (route.name === "Map") {
            iconName = "map";
          } else if (route.name === "New Pin") {
            iconName = "add-circle";
          } else if (route.name === "Profile") {
            iconName = "person";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Explore" component={WelcomeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="New Pin" component={NewPinScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AppRoutes() {
  const { initialized } = useContext(UserContext);

  if (!initialized) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="JobDetail" component={JobDetailScreen} options={{ headerShown: true, title: "Job Detail" }} />
        <Stack.Screen name="HaulerDashboard" component={HaulerDashboardScreen} options={{ headerShown: true, title: "Hauler Dashboard" }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: true, title: "WastePin Home" }} />
        <Stack.Screen name="Jobs" component={JobsScreen} options={{ headerShown: true, title: "Available Jobs" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
}
