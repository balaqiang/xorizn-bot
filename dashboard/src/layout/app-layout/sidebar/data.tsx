import { AiIcon, DatabaseIcon, GearIcon, LayoutGridIcon, ListIcon, PluginIcon, TaskIcon, UserCircleIcon, WhatsappIcon } from "@/icons";
import type { NavItem } from "./types";

export const navItems: NavItem[] = [
  { icon: <LayoutGridIcon className="size-6" />, key: "dashboard", path: "/" },
  { icon: <WhatsappIcon className="size-6" />, key: "groups", path: "/groups" },
  { icon: <PluginIcon className="size-6" />, key: "commands", path: "/commands" },
  { icon: <UserCircleIcon className="size-6" />, key: "users", path: "/users" },
  { icon: <AiIcon className="size-6" />, key: "ai", path: "/ai", new: true },
];

export const botItems: NavItem[] = [
  { icon: <GearIcon className="size-6" />, key: "settings", path: "/settings" },
];

export const systemItems: NavItem[] = [
  { icon: <DatabaseIcon className="size-6" />, key: "system", path: "/system" },
  { icon: <ListIcon className="size-6" />, key: "logs", path: "/logs" },
];

export const unusedIcons = { TaskIcon };
