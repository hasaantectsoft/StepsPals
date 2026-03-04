import { StyleSheet } from "react-native";
import { Theme } from "../../../libs";
import { Responsive } from "../../../libs";
import { scale } from "react-native-size-matters";
const { AppFonts } = Responsive;
export const styles = StyleSheet.create({
    wrapper: {
    flex: 1,
    backgroundColor: Theme.colors.primary,
  },
  headerContainer: {
    paddingTop: scale(30),
  },
  titleText: {
    color: Theme.colors.brown,
    fontSize: AppFonts.t1,
  },
});