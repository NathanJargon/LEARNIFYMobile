import { View, StyleSheet, ScrollView } from "react-native";
import { useTheme, List } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { getSecureStore } from "../utils/SecureStore";
import useStore from "../hooks/useStore";
import AppBar from "../components/AppBar";

export default function Setting() {
  const signOut = useStore((state) => state.signOut);
  const userToken = getSecureStore("userToken");
  const theme = useTheme();
  const navigation = useNavigation();
  console.log(userToken);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <AppBar hasProfileAvatar={true} title="Learnify" />

      <ScrollView style={styles.content}>
        {/* <List.Item
          title="Personal Info"
          style={styles.list}
          right={() => (
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color="black"
            />
          )}
          onPress={() => navigation.push("PersonalInfo")}
        />
        <List.Item
          title="Security"
          style={styles.list}
          right={() => (
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color="black"
            />
          )}
          onPress={() => navigation.push("Security")}
        /> */}
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
          onPress={signOut}
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
