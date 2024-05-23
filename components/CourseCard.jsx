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

      const totalActivities = activitySnapshot.docs.reduce((count, doc) => {
        const data = doc.data();
        if (data.courseId === course.id) {
          count[data.courseId] = (count[data.courseId] || 0) + 1;
        }
        return count;
      }, {});

      console.log('Total activities:', totalActivities);

      const completedActivities = activitySnapshot.docs.reduce((count, doc) => {
        const data = doc.data();
        if (data.courseId === course.id && data.ActivityResult) {
          console.log('ActivityResult:', data.ActivityResult);
          const userResult = data.ActivityResult.find(result => result.userEmail === userEmail);
          console.log('userEmail:', userEmail);
          console.log('userResult:', userResult);
          if (userResult && userResult.score >= 0) {
            count[data.courseId] = (count[data.courseId] || 0) + 1;
          }
        }
        return count;
      }, {});

      console.log('Completed activities:', completedActivities);

      const progress = {};
      for (const courseId in totalActivities) {
        progress[courseId] = completedActivities[courseId] / totalActivities[courseId];
      }

      console.log('Progress:', progress);

      setProgress(progress);
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
