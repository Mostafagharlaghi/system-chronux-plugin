import {
  type AccessMeta,
  type ContentRegistry,
  definePlugin,
  type MenuRegistry,
  type AccessControlService,
  type PluginContext,
  type Shell,
  TOKENS,
} from "@dolphin/app-sdk";
import Dashboard from "./components/index";
import { LuCalendar } from "react-icons/lu";
import pkg from "../package.json";

const SYSTEM_CHRONUX_VIEW_ID = "system-chronux-view";
const SYSTEM_CHRONUX_MENU_ID = "system-chronux-menu";
const SYSTEM_CHRONUX_PARENT_ID = "system";
const SYSTEM_CHRONUX_ROUTE = "/system/chronux";
const SYSTEM_CHRONUX_TITLE = "تقویم سازمانی";

const ACCESS = {
  title: SYSTEM_CHRONUX_TITLE,
  requiredPermissions: [
    "system.chronux.view",
  ],
} as const satisfies AccessMeta;

export const ChronuxPlugin = definePlugin({
  id: "@dolphin/system-chronux-plugin",
  name: "ChronuxPlugin",
  version: pkg.version,
  description: "Plugin that provides System Calendar management UI",

  async setup(ctx: PluginContext) {
    const log = ctx.logger;

    // Resolve core platform services
    let menuRegistry: MenuRegistry;
    let contentRegistry: ContentRegistry;
    let accessControl: AccessControlService;

    try {
      menuRegistry = ctx.resolve<MenuRegistry>(TOKENS.MenuRegistry);
      contentRegistry = ctx.resolve<ContentRegistry>(TOKENS.ContentRegistry);
      accessControl = ctx.resolve<AccessControlService>(
        TOKENS.AccessControlService,
      );
    } catch (err) {
      log.error("Failed to resolve essential services", err);
      throw new Error(
        "Required registries or access control are not available in PluginContext.",
      );
    }

    const checkAccess = (): boolean => {
      return accessControl.canAccess(ACCESS);
    };

    const activate = (): boolean => {
      if (!checkAccess()) {
        log.warn(
          `[ChronuxPlugin] Access denied. Required: ${ACCESS.requiredPermissions.join(", ")}`
        );
        return false;
      }

      try {
        const shell = ctx.resolve<Shell>(TOKENS.Shell);
        if (!shell) return false;

        const current = shell.getSlotState("workspace");
        if (current?.viewId === SYSTEM_CHRONUX_VIEW_ID) {
          return true;
        }

        return shell.activateView("workspace", SYSTEM_CHRONUX_VIEW_ID);
      } catch (err) {
        log.error("Failed to activate workspace view", err);
        return false;
      }
    };

    /**
     * 1️⃣ Register workspace menu item
     */
    menuRegistry.registerMenuItem({
      id: SYSTEM_CHRONUX_MENU_ID,
      label: SYSTEM_CHRONUX_TITLE,
      category: "workspace",
      group: "apps",
      parentId: SYSTEM_CHRONUX_PARENT_ID,
      icon: LuCalendar,
      order: 84,
      visible: checkAccess,
      meta: ACCESS,
      command: {
        id: "open-system-chronux",
      },
      onClick: activate,
    });

    /**
     * 2️⃣ Register view in content registry
     */
    contentRegistry.registerView({
      id: SYSTEM_CHRONUX_VIEW_ID,
      route: SYSTEM_CHRONUX_ROUTE,
      visible: checkAccess,
      loader: async () => ({
        default: Dashboard,
      }),
      meta: ACCESS,
    });

    return {
      success: true,
      contributions: [],
    };
  },
});

export default ChronuxPlugin;
export { default as Calendar } from "./components/index";
