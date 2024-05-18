import { StyleSheet, View, Text } from "react-native";

export function ReplyComment({message}) {
  return (
    <View style={[styles.container, styles.userComment]}>
      <View style={[styles.comment]}>
        <Text style={styles.commentator}>Anonymous</Text>
        <Text style={styles.content}>{message}</Text>
      </View>
      {/* <Text style={styles.timeStampt}>02:58 PM</Text> */}
    </View>
  );
}

export function PostComment({message}) {
  return (
    <View style={[styles.container, styles.otherComment]}>
    <View style={[styles.comment]}>
      <Text style={styles.commentator}>Anonymous</Text>
      <Text style={styles.content}>{message}</Text>
    </View>
    {/* <Text style={styles.timeStampt}>02:58 PM</Text> */}
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20
  },
  userComment: {
    marginLeft: 40,
    alignSelf: "flex-end",
  },
  otherComment: {
    marginRight: 40,
    alignSelf: "flex-start",
  },
  comment: {
    backgroundColor: "lightgray",
    borderRadius: 16,
    padding: 16,
  },
  commentator: {
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 10,
  },
  content: {
    lineHeight: 20,
  },
  timeStampt: {
    marginStart: 14,
    fontSize: 10,
  },
});
