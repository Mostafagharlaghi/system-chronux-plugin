import {
  MOCK_STATUSES,
  MOCK_TIMELINE_ITEMS,
  MOCK_CALENDAR_DAY_STATS,
  MOCK_CALENDAR_INTENSITY_RANGES,
  MOCK_STAFF_USERS,
  MOCK_STAFF_UNAVAILABILITIES,
  MOCK_BASE_CALENDAR_EVENTS,
  WORKING_HOURS_OVERRIDES,
  MOKE_DEPARTMENT_TREE,
  MOKE_STAFF_AFFINITIES,
  MOCK_DEPARTMENT_SHIFT_RULES_OVERRIDE,
  SHIFT_TIME_SLOT,
  MOCK_DEPARTMENT_SHIFT_RULES,
  MOCK_STAFF_WEEKLY_CONTRACTS,
  DEFAULT_CHRONUX_SETTINGS,
  ROLE_ORDER,
  MOCK_STAFF_ROSTER,
} from "@dolphin/ui";

export const commonArgs = {
  statuses: MOCK_STATUSES,
  timelineItems: MOCK_TIMELINE_ITEMS,
  calendarDayStats: MOCK_CALENDAR_DAY_STATS,
  calendarIntensityRanges: MOCK_CALENDAR_INTENSITY_RANGES,
  staffUsers: MOCK_STAFF_USERS,
  staffUnavailabilities: MOCK_STAFF_UNAVAILABILITIES,
  baseCalendarEvents: MOCK_BASE_CALENDAR_EVENTS,
  workingHoursOverrides: WORKING_HOURS_OVERRIDES,
  departmentTree: MOKE_DEPARTMENT_TREE,
  staffAffinities: MOKE_STAFF_AFFINITIES,
  departmentShiftRuleOverride: MOCK_DEPARTMENT_SHIFT_RULES_OVERRIDE,
  shiftSlot: SHIFT_TIME_SLOT,
  departmentShiftRules: MOCK_DEPARTMENT_SHIFT_RULES,
  staffWeeklyContract: MOCK_STAFF_WEEKLY_CONTRACTS,
  baseSettings: DEFAULT_CHRONUX_SETTINGS,
  roleOrder: ROLE_ORDER,
  staffRosterRow: MOCK_STAFF_ROSTER,
  currentUser: MOCK_STAFF_USERS[0],

  onShiftClick: (shift: any) => {
    console.log("Shift clicked:", shift);
  },
  onStaffRemoveFromShift: (shiftUuid: string, staffUuid: string) => {
    console.log(`Removed staff ${staffUuid} from shift ${shiftUuid}`);
  },
};
