import { Modal, View, StyleSheet } from "react-native";
import { ReactNode } from "react";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from "react-native-reanimated";
interface ModalScreenProps {
  isVisible: boolean;
  children: ReactNode;
  onClose: () => void;
}

export default function ModalScreen({
  isVisible,
  children,
  onClose,
}: ModalScreenProps) {
  const keyboard = useAnimatedKeyboard();

  const animatedStyles = useAnimatedStyle(() => ({
    bottom: keyboard.height.value,
    height: 800 - keyboard.height.value,
  }));

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <Animated.View style={[styles.modalContent, animatedStyles]}>
        {children}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    height: 800,
    width: "100%",
    backgroundColor: "#fff",
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: "absolute",
    bottom: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  titleContainer: {
    height: "16%",
    backgroundColor: "#464C55",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#fff",
    fontSize: 16,
  },
});
