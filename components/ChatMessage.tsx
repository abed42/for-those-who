import { View, Text, StyleSheet } from "react-native";

type ChatMessageType = {
  role: string;
  message: string;
};

export default function ChatMessage({ role, message }: ChatMessageType) {
  return (
    <View style={styles.layout}>
      <View style={styles[role]}>
        <Text>{message}</Text>
      </View>
    </View>
  );
}

const styles: any = StyleSheet.create({
  layout: {
    marginBottom: 12,
    display: "flex",
    flex: 1,
    width: "auto",
  },
  assistant: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#F9F7F7",
    alignSelf: "flex-start",
  },
  user: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#E0E5FF",
    alignSelf: "flex-end",
  },
});
