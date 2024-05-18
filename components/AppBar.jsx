import { TouchableOpacity, StyleSheet, Image, View } from "react-native";
import { Appbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { IconButton } from "react-native-paper";

export default function AppBar({
  style: customStyle,
  hasBackAction,
  hasLogo,
  title,
  titleSize,
  logoSize,
  hasProfileAvatar,
  hasStarIcon,
  userNotifications,
}) {
  const navigation = useNavigation();
  const logoSizeStyle = logoSize ?? 50;
  const titleSizeStyle = titleSize ?? 22;
  const hasLogoStyle = hasLogo ?? true;

  return (
    <Appbar.Header
      style={[customStyle, { backgroundColor: theme.colors.background }]}
    >
      {hasBackAction && (
        <Appbar.BackAction onPress={() => navigation.goBack()} />
      )}
      {hasLogoStyle && (
        <Image
          style={[
            styles.logo,
            {
              height: logoSizeStyle,
              width: logoSizeStyle,
              marginStart: hasBackAction ? 0 : 6,
            },
          ]}
          source={require("../assets/Icons/Logo.png")}
        />
      )}
        <Appbar.Content
          title={title}
          titleStyle={[styles.title, { fontSize: titleSizeStyle }]}
        />
        {hasProfileAvatar && (
          <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <Image
              source={require("../assets/Icons/bell.png")}
              style={{ height: 33, width: 33, marginEnd: 10 }}
            />
          </TouchableOpacity>
        )}
        {hasProfileAvatar && (
          <View style={{ marginEnd: 10 }}>
            <Image
              style={{ height: 33, width: 33 }}
              source={require("../assets/Icons/account_icon.png")}
            />
          </View>
        )}
      {hasStarIcon && (
        <Image
          style={styles.star}
          source={require("../assets/Icons/star.png")}
        />
      )}
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
  },
  logo: {
    marginEnd: 10,
    objectFit: "contain",
  },
  star: {
    position: "absolute",
    height: 60,
    width: 60,
    right: 0,
    top: -24,
  },
});