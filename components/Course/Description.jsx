import { View, ScrollView, StyleSheet, Image } from "react-native";
import { Avatar, Text } from "react-native-paper";

export default function Description({
  title,
  instructor,
  image,
  desc,
  objectives,
  topics,
}) {
  const courseObjectives = objectives?.map((objective, index) => (
    <Text key={index} style={styles.paragraph}>
      {index + 1} {objective}
    </Text>
  ));

  const courseTopics = topics?.map((topic, index) => (
    <Text key={index} style={styles.paragraph}>
      {index + 1} {topic}
    </Text>
  ));

  return (
    <ScrollView>
      <View style={styles.coverContainer}>
        <Image style={{ height: "100%", width: "100%", objectFit: "cover" }} source={require("../../assets/Icons/tempCover.jpg")} />
        <Avatar.Image
          size={45}
          style={styles.avatar}
          source={require("../../assets/Icons/instructor.jpg")}
        />
        <Text variant="labelSmall" style={styles.ownersName}>
          {instructor}
        </Text>
      </View>

      <View style={styles.descContainer}>
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.title}>
            Course Description:
          </Text>
          <Text style={styles.paragraph}>{desc}</Text>
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.title}>
            Course Objective:
          </Text>
          {courseObjectives}
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.title}>
            Course Topic:
          </Text>
          {courseTopics}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  coverContainer: {
    height: 300,
  },
  avatar: {
    position: "absolute",
    top: 8,
    left: 8,
  },
  ownersName: {
    position: "absolute",
    bottom: 4,
    right: 10,
    textTransform: "uppercase",
  },
  descContainer: {
    padding: 14,
  },
  section: {
    marginBottom: 44,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  paragraph: {
    fontSize: 15,
    color: "dimgrey",
    fontWeight: "normal",
    textAlign: "justify",
  },
});
