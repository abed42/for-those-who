import Action from "@/components/Action";
import AssistantChat from "@/components/AssistantChat";
import Clue from "@/components/Clue";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import ModalScreen from "@/components/modal";
import fetchWrapper from "@/utils/fetchWrapper";
import * as SecureStore from "expo-secure-store";
import { uniqueId } from "@/constants/UniqueId";
import { UserModel } from "@/models/user";

const Assistant = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const actions = [
    "I hate some of my clues",
    "I want to change some of my clues",
    "I want to read more about something",
    "I want to share something new about me",
  ];

  const [user, setUser] = useState<UserModel>();
  const [loading, setLoading] = useState<boolean>(true);

  const getUserClues = async () => {
    const token = await SecureStore.getItemAsync("token");
    const userId = await SecureStore.getItemAsync("userId");

    try {
      const response: any = await fetchWrapper(
        `/entities/users/${userId}?uniqueId=${uniqueId}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      setUser(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createAction = () => {
    setIsModalVisible(true);
  };

  useEffect(() => {
    getUserClues();
  }, []);

  return (
    <ScrollView style={styles.layout} keyboardShouldPersistTaps={"always"}>
      <View style={styles.assistant}>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Image
            source={require("@/assets/images/ftw-blue.png")}
            style={styles.assistantIcon}
          />
          <View style={{ flex: 1 }}>
            <Text>
              Hey there! I’m your AI assistant, ready to help you get the most
              relevant content.
            </Text>
            <View style={{ padding: 5 }} />
            <Text>How can I assist you today?</Text>
            <View style={{ padding: 8 }} />
            <View style={styles.actions}>
              {actions.map((action, index) => (
                <Action key={index} action={() => createAction()}>
                  {action}
                </Action>
              ))}
            </View>
          </View>
        </View>
      </View>
      <View style={{ padding: 16 }} />
      <View>
        <Text>Here are the clues you've given us</Text>
        <View style={{ padding: 8 }} />
        {loading ? (
          <ActivityIndicator />
        ) : (
          <View style={styles.clues}>
            {user &&
              user.Descriptors.map(({ clue, id }) => (
                <Clue key={id}>{clue}</Clue>
              ))}
          </View>
        )}
        <View style={{ padding: 8 }} />
      </View>
      <ModalScreen
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      >
        <AssistantChat setIsModalVisible={setIsModalVisible} />
      </ModalScreen>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  layout: {
    padding: 16,
    flex: 1,
    backgroundColor: "white",
  },
  assistant: {
    width: "100%",
    backgroundColor: "#F5FAFF",
    padding: 18,
    borderRadius: 12,
  },
  assistantIcon: {
    height: 24,
    width: 24,
    marginRight: 8,
  },
  actions: {
    display: "flex",
    gap: 5,
  },
  clues: {
    display: "flex",
    gap: 5,
    paddingBottom: 8,
  },
});

export default Assistant;
