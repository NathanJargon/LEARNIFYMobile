import { StyleSheet, View, Text } from "react-native";

export function ReplyComment({message, date, user}) {
  return (
    <View style={[styles.container, styles.userComment]}>
      <View style={[styles.comment]}>
        <Text style={styles.commentator}>{user}</Text>
        <Text style={styles.content}>{message}</Text>
        <Text style={styles.timeStamp}>{date}</Text>
      </View>
    </View>
  );
}

export function PostComment({message, date, user}) { 
  return (
    <View style={[styles.container, styles.otherComment]}>
      <View style={[styles.comment]}>
        <Text style={styles.commentator}>{user}</Text> 
        <Text style={styles.content}>{message}</Text>
        <Text style={styles.timeStamp}>{date}</Text>
      </View>
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
  timeStamp: {
    marginStart: 14,
    fontSize: 10,
  },
});
