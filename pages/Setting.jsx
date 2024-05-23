import { View, StyleSheet, ScrollView } from "react-native";
import { useTheme, List } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import AppBar from "../components/AppBar";
import { firebase } from "../utils/FirebaseConfig";

export default function Setting() {
  const theme = useTheme();
  const navigation = useNavigation();

  async function logout() {
    try {
      await AsyncStorage.clear();
      navigation.navigate("Login");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <AppBar hasProfileAvatar={true} title="Learnify" />

      <ScrollView style={styles.content}>
        <List.Item
          rippleColor="pink"
          title="Logout"
          titleStyle={{ color: "firebrick" }}
          right={() => (
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color="firebrick"
            />
          )}
          onPress={logout}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  logo: {
    marginEnd: 10,
    objectFit: "contain",
    height: 40,
    width: 40,
  },
  profile: {
    alignItems: "center",
  },
  footer: {
    marginTop: 50,
    marginBottom: 30,
  },
  list: {},
});