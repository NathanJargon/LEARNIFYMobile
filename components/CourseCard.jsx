import { Text, Card, Button, Avatar, ProgressBar } from "react-native-paper";
import { StyleSheet, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../utils/FirebaseConfig";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function CourseCard({ course, userEmail }) {
  const navigation = useNavigation();
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const calculateProgress = async () => {
      const db = getFirestore();
      const activitiesCollection = collection(db, "activities");

      const activitySnapshot = await getDocs(activitiesCollection);

      const activities = activitySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const totalActivities = activities.filter(activity => activity.courseId === course.id).length;

      const completedActivities = activities.reduce((count, activity) => {
        const isCompleted = activity.courseId === course.id && activity.ActivityResult && activity.ActivityResult.some(result => result.userEmail === userEmail);
        return isCompleted ? count + 1 : count;
      }, 0);

      console.log(`Total and completed activities for course ${course.id}:`, totalActivities, completedActivities);

      const progressPercentage = totalActivities > 0 ? (completedActivities / totalActivities) : 0;

      setProgress({ [course.id]: progressPercentage });
    };

    calculateProgress();
  }, [course, userEmail]);

  const InstructorAvatar = (props) => (
    <Avatar.Image
      {...props}
      style={{ backgroundColor: theme.colors.surface }}
      source={require("../assets/Icons/instructor.jpg")}
    />
  );

  const CourseName = () => (
    <Text
      variant="titleMedium"
      style={{ fontWeight: "bold", textTransform: "uppercase" }}
    >
      {course.courseName}
    </Text>
  );

  const Progress = () => {
    let progressDecimal = progress[course.id] || 0;
  
    return (
      <View style={{ gap: 4 }}>
        <ProgressBar progress={progressDecimal} />
        <Text style={styles.completeLabel}>{Math.round(progressDecimal * 100)}% Complete</Text>
      </View>
    );
  };

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.background }]}>
      <Card.Title
        style={styles.header}
        title={course.userEmail}
        titleStyle={[styles.instructorName, { color: theme.colors.secondary }]}
        left={InstructorAvatar}
        right={CourseName}
      />
      <View style={styles.body}>
        <View style={styles.leftBody}>
          <Image
            style={styles.courseImage}
            source={require("../assets/Icons/tempCover.jpg")}
          />
          <View style={styles.courseVideoCount}>
            <Text style={styles.courseVideoCountLabel}>10 videos</Text>
          </View>
        </View>

        <View style={styles.rightBody}>
          <Card.Content>
            <Progress />
          </Card.Content>
          <Card.Actions>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() =>
                navigation.navigate("Course", {
                  id: course.id,
                  imgPath: course.image_path,
                })
              }
            >
              View Course
            </Button>
          </Card.Actions>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "gainsboro",
    paddingRight: 6,
  },
  body: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 16,
  },
  header: {
    paddingEnd: 14,
  },
  instructorName: {
    fontWeight: "bold",
    fontSize: 14,
  },
  completeLabel: {
    fontSize: 12,
    textAlign: "right",
  },
  leftBody: {
    width: "45%",
    marginRight: 10,
  },
  courseImage: {
    // width: "100%",
    // height: 120,
    marginStart: 15,
    borderRadius: 6,
    height: "100%",
    width: "100%",
    objectFit: "cover",
  },
  courseVideoCount: {
    position: "absolute",
    left: 18,
    top: 3,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
    backgroundColor: "rgba(0, 0, 0, 0.49)",
  },
  courseVideoCountLabel: {
    fontSize: 6,
    color: "white",
  },
  rightBody: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 10,
  },
  button: {
    flex: 1,
  },
});
