import { roundIcon } from "@/assets/images";
import { strings } from "@/constants/AppStrings";

export const getDashboardMenu = (role: string) => {
  let menu: { label: string; image?: any; route?: any }[] = [];
  if (role === "student") {
    menu = [
      {
        label: strings.homeMenu.showQr,
        image: roundIcon,
        route: "/(drawer)/home/(showqr)",
      },
      {
        label: strings.homeMenu.applyLeave,
        image: roundIcon,
        route: "/(drawer)/home/(applyleave)",
      },
      {
        label: strings.homeMenu.viewBill,
        image: roundIcon,
        route: "/(drawer)/home/(viewbill)",
      },
      {
        label: strings.homeMenu.leaveHistory,
        image: roundIcon,
        route: "/(drawer)/home/(leavehistory)",
      },
    ];
  } else if (role === "admin") {
    menu = [
      {
        label: strings.homeMenu.scanQr,
        image: roundIcon,
        route: "/(drawer)/home/(scanqr)",
      },
      {
        label: strings.homeMenu.todayLeaves,
        image: roundIcon,
        route: "/(drawer)/home/(scanqr)",
      },
      {
        label: strings.homeMenu.submitAttendance,
        image: roundIcon,
        route: "/(drawer)/home/(scanqr)",
      },
      {
        label: strings.homeMenu.collection,
        image: roundIcon,
        route: "/(drawer)/home/(scanqr)",
      },
    ];
  } else if (role === "super admin") {
    menu = [
      {
        label: strings.homeMenu.todayLeaves,
        image: roundIcon,
        route: "/(drawer)/home/(scanqr)",
      },
      {
        label: strings.homeMenu.collection,
        image: roundIcon,
        route: "/(drawer)/home/(scanqr)",
      },
    ];
  }
  return menu;
};

export const getDrawerMenu = (role: string) => {
  const labelString = strings.drawerMenu;
  let drawerMenu: string[] = [labelString.home, labelString.changePassword];

  let roleMenu: string[] = [];
  if (role === "student") {
    roleMenu = [labelString.billingHistory];
  } else if (role === "superAdmin") {
    roleMenu = [labelString.billingHistory];
  } else if (role === "admin") {
    roleMenu = [labelString.billingHistory];
  }
  drawerMenu.splice(1, 0, ...roleMenu);
  return drawerMenu;
};

export const lcFirst = (value: string) => {
  if (typeof value !== "string") {
    return "";
  }
  return value[0].toLowerCase() + value.slice(1);
};
