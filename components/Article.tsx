import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import Svg, { Path } from "react-native-svg";

const removeSpecialChars = (text: string) =>
  text.replaceAll("\n", "").replaceAll("\t", "");

const LinkSvg = () => {
  return (
    <Svg style={styles.linkSvg} viewBox="0 0 640 512">
      <Path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" />
    </Svg>
  );
};

const ArrowSvg = () => {
  return (
    <Svg style={styles.shareSvg} viewBox="0 0 500 500">
      <Path d="M307 34.8c-11.5 5.1-19 16.6-19 29.2v64H176C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96h96v64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z" />
    </Svg>
  );
};
export default function Article({ article }: { article: any }) {
  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.title}>{article.Article.title}</Text>
        <Image source={require("../assets/images/testImage.png")} />
      </View>
      <Text>{removeSpecialChars(article.Article.content)}</Text>
      <View style={styles.actions}>
        <View style={styles.link}>
          <LinkSvg />
          <Text style={styles.linkText}>{article.Article.Source?.name}</Text>
        </View>
        <View style={styles.share}>
          <ArrowSvg />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 8,
    marginTop: 20,
  },
  title: {
    fontFamily: "SourseSerif4",
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 8,
  },
  actions: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  share: {
    borderWidth: 1,
    display: "flex",
    alignItems: "center",
    padding: 8,
    borderColor: "#F9F7F7",
    borderRadius: 50,
  },
  shareSvg: {
    //@ts-ignore
    fill: "#979BB1",
    width: 16,
    height: 16,
  },
});
