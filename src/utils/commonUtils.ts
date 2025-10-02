import Images from "@/assets/images";
import { strings } from "@/src/constants";

export const getDashboardMenu = (role: string) => {
  let menu: { label: string; image?: any; route?: any; isDisable: boolean }[] =
    [];

  if (role === "student") {
    menu = [
      {
        label: strings.homeMenu.showQr,
        image: Images.roundIcon,
        route: "showQR",
        isDisable: false,
      },
      {
        label: strings.homeMenu.applyLeave,
        image: Images.roundIcon,
        route: "applyLeave",
        isDisable: false,
      },
      {
        label: strings.homeMenu.viewBill,
        image: Images.roundIcon,
        route: "viewBill",
        isDisable: checkDate() ? false : true,
      },
      {
        label: strings.homeMenu.leaveHistory,
        image: Images.roundIcon,
        route: "leaveHistory",
        isDisable: false,
      },
    ];
  } else if (role === "admin") {
    menu = [
      {
        label: strings.homeMenu.scanQr,
        image: Images.roundIcon,
        route: "sanQR",
        isDisable: false,
      },
      {
        label: strings.homeMenu.todayLeaves,
        image: Images.roundIcon,
        route: "sanQR",
        isDisable: false,
      },
      {
        label: strings.homeMenu.submitAttendance,
        image: Images.roundIcon,
        route: "sanQR",
        isDisable: false,
      },
      {
        label: strings.homeMenu.collection,
        image: Images.roundIcon,
        route: "sanQR",
        isDisable: false,
      },
    ];
  } else if (role === "super admin") {
    menu = [
      {
        label: strings.homeMenu.todayLeaves,
        image: Images.roundIcon,
        route: "sanQR",
        isDisable: false,
      },
      {
        label: strings.homeMenu.collection,
        image: Images.roundIcon,
        route: "sanQR",
        isDisable: false,
      },
    ];
  }
  return menu;
};

export const lcFirst = (value: string) => {
  if (typeof value !== "string") {
    return "";
  }
  return value[0].toLowerCase() + value.slice(1);
};

export const checkDate = () => {
  const today = new Date();
  const dayOfMonth = today.getDate();
  if (dayOfMonth >= 1 && dayOfMonth <= 31) {
    return true;
  }
  return false;
};
