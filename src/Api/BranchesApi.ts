import { apiClient } from "@dolphin/app-core";
import type { ComponentProps } from "react";
import type { AppChronux } from "@dolphin/ui";
import { BRANCHES_INDEX_ALL } from "./Routes";



export type CalendarBranch = ComponentProps<
  typeof AppChronux
>["branches"][number];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isBranchBranding(
  value: unknown,
): value is NonNullable<CalendarBranch["branding"]> {
  return (
    isRecord(value) &&
    typeof value.branding_uuid === "string" &&
    typeof value.branch_uuid === "string" &&
    typeof value.primary_color === "string" &&
    [
      "secondary_color",
      "accent_color",
      "logo_url",
      "icon_url",
      "letterhead_url",
    ].every(
      (key) =>
        value[key] === undefined ||
        value[key] === null ||
        typeof value[key] === "string",
    )
  );
}

function isBranchCalendarSettings(
  value: unknown,
): value is NonNullable<CalendarBranch["calendar_settings"]> {
  return (
    isRecord(value) &&
    typeof value.branch_uuid === "string" &&
    typeof value.dayStartHour === "string" &&
    typeof value.dayEndHour === "string" &&
    typeof value.calendarHourHeight === "number" &&
    ["jalali", "gregorian", "hijri"].includes(String(value.calendarSystem))
  );
}

function getBranchBranding(
  value: unknown,
  branchUuid: string,
): NonNullable<CalendarBranch["branding"]> {
  if (isBranchBranding(value)) return value;

  return {
    branding_uuid: `default-branding-${branchUuid}`,
    branch_uuid: branchUuid,
    primary_color: "#3182ce",
    secondary_color: "#ebf8ff",
    accent_color: "#2b6cb0",
    letterhead_url: null,
  };
}

function getBranchCalendarSettings(
  value: unknown,
  branchUuid: string,
): NonNullable<CalendarBranch["calendar_settings"]> {
  if (isBranchCalendarSettings(value)) return value;

  return {
    branch_uuid: branchUuid,
    dayStartHour: "00:00",
    dayEndHour: "24:00",
    day_start_minute: 0,
    day_end_minute: 1440,
    calendarHourHeight: 60,
    slotMinutes: 15,
    calendarSystem: "jalali",
    timezone: "Asia/Tehran",
    weekStartsOn: 6,
    workingDays: [6, 0, 1, 2, 3, 4],
  };
}

function toCalendarBranch(value: unknown, index: number): CalendarBranch {
  if (!isRecord(value)) {
    throw new Error(`اطلاعات شعبه در ردیف ${index + 1} معتبر نیست.`);
  }

  const id =
    typeof value.id === "number"
      ? value.id
      : typeof value.id === "string" && value.id.trim() !== ""
        ? Number(value.id)
        : Number.NaN;
  const branchUuid = value.branch_uuid;
  const name = value.name;

  if (
    !Number.isFinite(id) ||
    typeof branchUuid !== "string" ||
    branchUuid.trim() === "" ||
    typeof name !== "string" ||
    name.trim() === ""
  ) {
    throw new Error(
      `شناسه، شناسهٔ یکتا یا نام شعبه در ردیف ${index + 1} معتبر نیست.`,
    );
  }

  const isActive =
    value.is_active === true ||
    value.is_active === 1 ||
    value.is_active === "1" ||
    value.is_active === "true";
  const isInactive =
    value.is_active === false ||
    value.is_active === 0 ||
    value.is_active === "0" ||
    value.is_active === "false";

  if (!isActive && !isInactive) {
    throw new Error(`وضعیت فعال بودن شعبه در ردیف ${index + 1} معتبر نیست.`);
  }

  const optionalText = (field: unknown) =>
    typeof field === "string" ? field : "";

  return {
    id,
    branch_uuid: branchUuid,
    name,
    address: optionalText(value.address),
    phone: optionalText(value.phone),
    email: optionalText(value.email),
    created_by_uuid: optionalText(value.created_by_uuid),
    is_active: isActive,
    branding: getBranchBranding(value.branding, branchUuid),
    calendar_settings: getBranchCalendarSettings(
      value.calendar_settings,
      branchUuid,
    ),
  };
}

function extractBranchList(payload: unknown): CalendarBranch[] {
  const root = isRecord(payload) ? payload : undefined;
  const data = isRecord(root?.data) ? root.data : undefined;
  const result = isRecord(root?.result) ? root.result : undefined;
  const resultData = isRecord(result?.data) ? result.data : undefined;
  const candidates = [
    payload,
    root?.data,
    data?.data,
    data?.items,
    data?.branches,
    root?.result,
    result?.data,
    resultData?.items,
    resultData?.branches,
    root?.items,
    root?.branches,
  ];
  const list = candidates.find(Array.isArray);

  if (!Array.isArray(list)) {
    throw new Error("ساختار پاسخ فهرست شعب معتبر نیست.");
  }

  return list.map(toCalendarBranch);
}

export async function getBranches(
  signal?: AbortSignal,
): Promise<CalendarBranch[]> {
  const response = await apiClient.get<unknown>(BRANCHES_INDEX_ALL, { signal });
  return extractBranchList(response.data);
}
