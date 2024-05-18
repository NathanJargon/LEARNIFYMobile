import {
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  View,
  ScrollView,
} from "react-native";
import { Text } from "react-native-paper";
import { ReplyComment, PostComment } from "./ForumComment";
import { TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

export default function Forum({ forums }) {
  const renderItems = ({ item, index }) => {
    if (item.length <= 0) {
      return;
    }
    if (item.includes("Reply")) {
      return <PostComment key={index} message={item} />;
    } else {
      return <ReplyComment key={index} message={item} />;
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.body}
        contentContainerStyle={{ paddingBottom: 50 }}
        data={forums}
        renderItem={renderItems}
        keyExtractor={(item, index) => index}
        ListEmptyComponent={
          <Text style={{ color: theme.colors.secondary }}>No Forums</Text>
        }
      />

      <KeyboardAvoidingView style={styles.bottomFields}>
        <TextInput mode="outlined" style={styles.commentField} />
        <Ionicons name="send" size={24} color={theme.colors.primary} />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 14,
    marginBottom: 80,
  },
  bottomFields: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    bottom: 0,
    right: 0,
    left: 0,
    height: 80,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  commentField: {
    flex: 1,
    borderRadius: 16,
  },
});
