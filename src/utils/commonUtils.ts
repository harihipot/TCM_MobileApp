import Images from "@/assets/images";
import { strings } from "@/src/constants";
import { DAY_NAMES } from "../constants/Constants";
import moment from "moment";

export const getDashboardMenu = (role: string) => {
  let menu: { label: string; image?: any; route?: any; isDisable: boolean }[] =
    [];

  if (role?.toLowerCase() === "student") {
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
  } else if (role?.toLowerCase() === "admin") {
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
        route: "showQR",
        isDisable: false,
      },
      {
        label: strings.homeMenu.submitAttendance,
        image: Images.roundIcon,
        route: "attendanceSubmission",
        isDisable: false,
      },
    ];
  } else if (role?.toLowerCase() === "super admin") {
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
  return value[0]?.toLowerCase() + value?.slice(1);
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


export function extractDetails(text: any) {
  // 1️⃣ DATE-TIME PATTERNS (covers all apps)
  const datePatterns = [
    /\b(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4},?\s*\d{1,2}[:.]\d{2}\s*(?:AM|PM)?)\b/i,  // e.g. "17 Sept 2025, 12:45PM"
    /\b(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})\b/i,                                   // e.g. "5 Nov 2025"
    /\b(\d{1,2}[:]\d{2}\s*(?:AM|PM))\b/i                                        // e.g. "08:33 pm"
  ];

  // 2️⃣ TRANSACTION ID / UTR / GOOGLE PAY ID / CRED ID
  const txnPatterns = [
    /\b[TU]\d{10,30}\b/i,                         // e.g. T2509132033350083299953 , UTR: 701124931679
    /\b[0-9A-Za-z]{10,30}\b/i,                    // Generic GPay: CICAgOiW_pTFSw
    /\b\d{12,30}\b/i                              // Long number IDs (CRED)
  ];

  // Extract date
  let extractedDate = null;
  for (let p of datePatterns) {
    const m = text.match(p);
    if (m) { extractedDate = m[1]; break; }
  }

  // Extract transaction ID
  let extractedTxn = null;
  for (let p of txnPatterns) {
    const m = text.match(p);
    if (m) {
      extractedTxn = m[0];
      break;
    }
  }

  return {
    transactionId: extractedTxn,
    date: extractedDate
  };
}


function convertToStandardDate(text: any) {
  let clean = text.trim();

  // Fix missing space before am/pm → 12:14pm → 12:14 pm
  clean = clean.replace(/(\d)(am|pm)/gi, "$1 $2");

  // Remove "on"
  clean = clean.replace(/\bon\s+/i, "");

  // Remove ordinal suffix (1st → 1)
  clean = clean.replace(/(\d+)(st|nd|rd|th)/gi, "$1");

  // Insert space between month and year (aug25 → aug 25)
  clean = clean.replace(/([A-Za-z]+)(\d{2,4})/g, "$1 $2");

  // Extract time anywhere
  const timeMatch = clean.match(/\b\d{1,2}:\d{2}\s*[ap]m\b/i);
  const time = timeMatch ? timeMatch[0] : "00:00 am";

  clean = clean.replace(time, "")

  // Extract date properly
  const dateMatch = clean.match(/\b(\d{1,2})\s+([A-Za-z]+)\s+(\d{2,4})\b/);
  if (!dateMatch) return null;

  let [, day, month, year] = dateMatch;

  // Fix 2-digit year → 20xx
  if (year.length === 2) year = "20" + year;

  const raw = `${day} ${month} ${year} ${time}`;

  // DO NOT use strict mode — this is why other attempts return null
  const parsed = moment(raw, [
    "D MMM YYYY h:mm A",
    "D MMMM YYYY h:mm A",
    "D MMM YY h:mm A",
    "D MMMM YY h:mm A",
  ]);

  if (!parsed.isValid()) return null;

  return parsed.format("YYYY-MM-DD hh:mm A");
}




export function parseUPIScreenshotText(rawText: any) {
  const text = rawText.replace(/\s+/g, " ").trim();

  // -------------------------------
  // Detect App
  // -------------------------------
  function detectApp(t: any) {
    if (/CRED/i.test(t)) return "CRED";
    if (/PhonePe|Pe /i.test(t)) return "PhonePe";
    if (/Google Pay|GPay|G Pay/i.test(t)) return "Google Pay";
    if (/Paytm/i.test(t)) return "Paytm";
    if (/BHIM/i.test(t)) return "BHIM";
    return "Unknown";
  }

  // -------------------------------
  // Amount
  // -------------------------------
  function extractAmount(v: any) {
    // Strong UPI amount extractor
    const patterns = [
      /₹\s?([0-9,]+(?:\.\d{1,2})?)/,          // ₹10,000 or ₹10000.00
      /Rs\.?\s?([0-9,]+(?:\.\d{1,2})?)/i,     // Rs 10000
      /INR\s?([0-9,]+(?:\.\d{1,2})?)/i,       // INR 10000
      /\b([0-9]{2,6},[0-9]{2,6})\b/,          // 10,000 format without ₹
      /\b([0-9]{3,7}\.\d{1,2})\b/,             // 10000.00
      /(?:₹|Rs\.?|INR)?\s?([0-9,]{2,10})/i
    ];

    for (const p of patterns) {
      const m = v.match(p);
      if (m) return m[1];
    }

    return null;
  }


  // -------------------------------
  // Date
  // -------------------------------
  function extractDate(v: any) {
    const clean = text.replace(/on\s+/i, "").replace(/'/g, "");

    // UNIVERSAL REGEX for all 3 formats
    // JS doesn't support the 'x' (free-spacing) regex flag; use a compact RegExp
    const regex = /\b(?:(\d{1,2}:\d{2}\s*[ap]m)[,\s]*)?(?:on\s*)?(\d{1,2})(?:st|nd|rd|th)?\s*([A-Za-z]+)\s*(\d{2,4})(?:[,\s]*(\d{1,2}:\d{2}\s*[ap]m))?\b/i;

    const match = clean.match(regex);
    if (!match) return null;

    // return the matched substring (e.g. "17 Sept 2025, 12:45PM")
    return match[0].trim();
  }

  // -------------------------------
  // Transaction ID
  // -------------------------------
  function extractTxnId(t: any) {
    const patterns = [
      /\bT[0-9]{12,30}\b/i,           // PhonePe
      /\bUTR[: ]?\s?([0-9]{10,20})\b/i, // UTR
      /\bC[A-Za-z0-9_]{10,30}\b/,     // Google Pay
      /\b[0-9]{11,20}\b/              // CRED numeric
    ];
    for (let r of patterns) {
      const m = t.match(r);
      if (m) return m[1] || m[0];
    }
    return null;
  }

  // -------------------------------
  // Sender
  // -------------------------------
  function extractSender(t: any) {
    const s1 = t.match(/From[: ]+([A-Za-z ]{3,50})/i);
    if (s1) return s1[1].trim();

    const s2 = t.match(/from\s+([A-Za-z ]{3,50})/i);
    if (s2) return s2[1].trim();

    return null;
  }

  // -------------------------------
  // Receiver
  // -------------------------------
  function extractReceiver(t: any) {
    const r1 = t.match(/To[: ]+([A-Za-z ]{3,50})/i);
    if (r1) return r1[1].trim();

    const r2 = t.match(/Paid to\s+([A-Za-z ]{3,50})/i);
    if (r2) return r2[1].trim();

    const r3 = t.match(/paid\s+([A-Za-z ]{3,50})/i);
    if (r3) return r3[1].trim();

    return null;
  }

  // -------------------------------
  // Final Output
  // -------------------------------
  return {
    // app: detectApp(text),
    amount: extractAmount(text),
    date: convertToStandardDate(extractDate(text)),
    transactionId: extractTxnId(text),
    // sender: extractSender(text),
    // receiver: extractReceiver(text)
  };
}


export const hasRequiredFields = <T extends Record<string, any>>(
  obj: T | null | undefined,
  fields?: (keyof T)[]
) => {
  if (!obj) return false;
  const keys =
    fields && fields.length > 0 ? fields : (Object.keys(obj) as (keyof T)[]);
  return keys.every((f) => {
    const val = (obj as any)[f];
    if (val === null || val === undefined) return false;
    if (typeof val === "string" && val.trim() === "") return false;
    return true;
  });
};


export const mealItemBasedOnNow = (mealsList: any) => {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  for (const meal of mealsList) {
    // meal.timing: "7 AM - 10 AM"
    const [startStr, endStr] = meal.timing
      .split("-")
      .map((s: string) => s.trim());
    const parseTime = (timeStr: string) => {
      // e.g. "7 AM" or "10:30 PM"
      const [time, period] = timeStr.split(" ");
      let hour: number, minute: number;
      if (time.includes(":")) {
        const [h, m] = time.split(":");
        hour = parseInt(h, 10);
        minute = parseInt(m, 10);
      } else {
        hour = parseInt(time, 10);
        minute = 0;
      }
      if (period.toUpperCase() === "PM" && hour !== 12) hour += 12;
      if (period.toUpperCase() === "AM" && hour === 12) hour = 0;
      return hour * 60 + minute;
    };
    const startMinutes = parseTime(startStr);
    const endMinutes = parseTime(endStr);
    if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) {
      return meal;
    }
  }
  return null; // No meal found for current time
};