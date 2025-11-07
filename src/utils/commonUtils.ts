import Images from "@/assets/images";
import { strings } from "@/src/constants";
import { DAY_NAMES } from "../constants/Constants";

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
        route: "attendanceSubmission",
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

/**
 * Build sections grouped by weekday and then by meal type.
 * Returns an array of sections suitable for a SectionList:
 * [ { title: 'monday', data: [ { meal: 'Breakfast', items: [...] }, ... ] }, ... ]
 */
export const buildMenuSections = (menuItems: any[] | null) => {
  if (!Array.isArray(menuItems) || menuItems.length === 0) return [];
  const normalizeDay = (raw: any): string[] => {
    if (!raw && raw !== 0) return [];
    if (Array.isArray(raw))
      return raw.map((d) => {
        const v = String(d).trim();
        if (!v) return v;
        return v[0].toUpperCase() + v.slice(1).toLowerCase();
      });
    if (typeof raw === "string") {
      return raw
        .split(/[,;|]/)
        .map((s) => {
          const v = s.trim();
          if (!v) return v;
          return v[0].toUpperCase() + v.slice(1).toLowerCase();
        })
        .filter(Boolean);
    }
    return [];
  };

  const extractItems = (entry: any): string[] => {
    const list: string[] = [];
    if (Array.isArray(entry.foodItems)) list.push(...entry.foodItems);
    return list;
  };

  // prepare map: day -> meal -> aggregated items
  const map: Record<string, Record<string, string[]>> = {};

  menuItems.forEach((entry: any) => {
    const rawDays = entry.day;

    const days = normalizeDay(rawDays);

    // if no days provided, treat as available all days
    const targetDays = days.length > 0 ? days : DAY_NAMES;

    const mealType = entry.dailyMeal.menuName;

    const items = extractItems(entry);

    targetDays.forEach((d) => {
      if (!map[d]) map[d] = {};
      if (!map[d][mealType]) map[d][mealType] = [];
      map[d][mealType].push(...items);
    });
  });

  // build sections in weekday order
  const sections: Array<{ day: string; meals: Array<any> }> = [];
  DAY_NAMES.forEach((d) => {
    if (!map[d]) return; // skip empty days
    const meals = Object.keys(map[d]).map((meal) => ({
      title: meal,
      data: Array.from(new Set(map[d][meal])), // unique items
    }));

    sections.push({ day: d, meals: meals });
  });
  return sections;
};

/**
 * Given a day section object ({ title: 'Monday', data: [{ meal: 'Breakfast', items: [...] }, ...] })
 * or ({ day: 'Monday', menu: [...] }), return the meal object for the current time window:
 * - before 10:30 => Breakfast
 * - 10:30 - 14:30 => Lunch
 * - 14:30 - 23:00 => Dinner
 * If no matching meal found, returns null.
 */
export const pickMealForNow = (daySection: any) => {
  if (!daySection) return null;

  const meals = Array.isArray(daySection.meals) ? daySection.meals : [];
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();

  const before1030 = minutes < 10 * 60 + 30; // < 10:30
  const between1030_1530 = minutes >= 10 * 60 + 30 && minutes < 15 * 60 + 30; // 10:30 - 14:30
  const between1530_2300 = minutes >= 15 * 60 + 30 && minutes <= 23.7 * 60; // 15:30 - 23:00

  const toMealObject = (
    section: any,
    opts?: { onlyActive?: boolean; lowerCaseNames?: boolean }
  ): { title: string; meals: string[] } => {
    const list = section?.data ?? section?.menu ?? [];
    const names = list
      .filter((i: { isActive: any }) =>
        opts?.onlyActive ? !!i.isActive : true
      )
      .map((i: { name: any }) => (i.name ?? "").trim())
      .filter(Boolean)
      .map((n: string) => (opts?.lowerCaseNames ? n.toLowerCase() : n));
    return { title: section?.title ?? section?.day ?? "", meals: names };
  };

  const findMeal = (names: string[]) => {
    const lower = names.map((n) => n.toLowerCase());
    const mealNow = meals.find((m: any) =>
      m.title
        .toString()
        .split(/[,/\\-]/)
        .map((s: string) => s.trim().toLowerCase())
        .some((t: string) => lower.includes(t))
    );
    return toMealObject(mealNow);
  };

  if (before1030) {
    return findMeal(["breakfast", "morning"]) || null;
  }
  if (between1030_1530) {
    return findMeal(["lunch", "noon"]) || null;
  }
  if (between1530_2300) {
    return findMeal(["dinner", "evening", "supper"]) || null;
  }

  return null;
};

export const getTimeOptions = () => {
  const options: { label: string; value: string }[] = [];
  for (let hour = 0; hour < 24; hour++) {
    // 12-hour hour number (1..12)
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const ampm = hour < 12 ? "AM" : "PM";
    const label = `${hour12} ${ampm}`;
    const value = `${hour12} ${ampm}`;
    options.push({ label, value });
  }
  return options;
};
