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
  permissionsImage: {
    width: "100%",
    height: scale(100),
    alignSelf: "center",
    marginBottom: scale(24),
  },
  headerContainer: {
    paddingTop: scale(30),
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(20),
  },
  permissionBlock: {
    padding: scale(16),
    borderRadius: scale(8),
    borderWidth: 3,
    borderColor: Theme.colors.white,
    marginBottom: scale(16),
  },
  permissionBlockOrange: {
    backgroundColor: Theme.colors.oragne || "#E89B4C",
  },
  permissionBlockTeal: {
    backgroundColor: "#7FB3B8",
  },
  permissionTitle: {
    fontFamily: Theme.typography.Retro.fontFamily,
    fontSize: scale(11),
    color: Theme.colors.black,
    marginBottom: scale(8),
  },
  permissionReason: {
    fontFamily: Theme.typography.Retro.fontFamily,
    fontSize: scale(9),
    color: Theme.colors.black,
    lineHeight: scale(14),
  },
  explanationText: {
    fontFamily: Theme.typography.Retro.fontFamily,
    fontSize: scale(9),
    color: Theme.colors.brown,
    lineHeight: scale(14),
    marginBottom: scale(12),
    textAlign: "center",
  },
  buttonWrap: {
    marginTop: scale(24),
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: scale(20),
    paddingBottom: scale(24),
  },
  footerLink: {
    fontFamily: Theme.typography.Retro.fontFamily,
    fontSize: scale(8),
    color: Theme.colors.brown,
    textDecorationLine: "underline",
  },
});
