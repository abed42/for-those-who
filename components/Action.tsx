import { TouchableOpacity, StyleSheet, Text } from "react-native";

type ActionType = {
  children: React.ReactNode;
  action?: () => void;
};

export default function Action({ children, action }: ActionType) {
  return (
    <TouchableOpacity onPress={action} style={styles.layout}>
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  layout: {
    padding: 12,
    borderColor: "#0029FF",
    borderRadius: 50,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  text: {
    color: "#0029FF",
  },
});
