import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";
import Svg, { Path } from "react-native-svg";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useContext, useState } from "react";
import { AssistantArticleContext } from "@/app/contexts/AssistantArticleContext";

const LinkSvg = () => {
  return (
    <Svg style={styles.linkSvg} viewBox="0 0 640 512">
      <Path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" />
    </Svg>
  );
};

type ArticlePreviewType = {
  article: any;
};

export default function ArticlePreview() {
  const { article } = useContext(AssistantArticleContext);

  const handlePressButtonAsync = async () => {
    await WebBrowser.openBrowserAsync(article.link);
  };

  return (
    <View style={[styles.layout]}>
      <View style={[styles.head]}>
        <Text style={styles.title} numberOfLines={4}>
          {article.title}
        </Text>
        {article.imageUrl && (
          <Image
            style={styles.image}
            source={{
              uri: article.imageUrl,
            }}
          />
        )}
      </View>
      <View>
        <View style={[styles.actions]}>
          {article.Source?.name && (
            <TouchableOpacity
              style={styles.link}
              onPress={handlePressButtonAsync}
            >
              <LinkSvg />
              <Text style={styles.linkText}>{article.Source?.name}</Text>
            </TouchableOpacity>
          )}

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
            }}
          >
            <Text style={[styles.action]}>•</Text>
            <FontAwesome5 name="glasses" size={12} color="#979BB1" />
            <Text style={[styles.action]}>5 min read</Text>
          </View>
          <Text style={[styles.action]}>•</Text>
          <Text style={[styles.action]}>
            based on <Text style={[styles.italics]}>2 clues</Text>
          </Text>
          <View></View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    padding: 16,
    backgroundColor: "#F9F7F7",
    borderRadius: 20,
    marginBottom: 12,
  },
  head: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 8,
  },
  title: {
    fontFamily: "SourseSerif4",
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 8,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  link: {
    width: "auto",
    backgroundColor: "#F5FAFF",
    padding: 8,
    borderRadius: 30,
    alignSelf: "flex-start",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  linkText: {
    color: "#0029FF",
    fontWeight: "bold",
  },
  linkSvg: {
    //@ts-ignore
    fill: "#0029FF",
    width: 20,
    height: 20,
    marginRight: 8,
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    flexWrap: "wrap",
  },
  action: {
    color: "#979BB1",
  },
  italics: {
    textDecorationLine: "underline",
  },
});
