import { AiIcon, CodeIcon, DatabaseIcon, GearIcon, LayoutGridIcon, LinkIcon, ListIcon, PluginIcon, TaskIcon, UserCircleIcon, WhatsappIcon } from "@/icons";
import type { NavItem } from "./types";

export const navItems: NavItem[] = [
  { icon: <LayoutGridIcon className="size-6" />, key: "dashboard", path: "/" },
  { icon: <WhatsappIcon className="size-6" />, key: "groups", path: "/groups" },
  { icon: <PluginIcon className="size-6" />, key: "commands", path: "/commands" },
  { icon: <UserCircleIcon className="size-6" />, key: "users", path: "/users" },
  { icon: <AiIcon className="size-6" />, key: "ai", path: "/ai" },
];

export const botItems: NavItem[] = [
  { icon: <GearIcon className="size-6" />, key: "settings", path: "/settings" },
  { icon: <CodeIcon className="size-6" />, key: "custom", path: "/custom", new: true },
  { icon: <LinkIcon className="size-6" />, key: "integrations", path: "/integrations", new: true },
];

export const systemItems: NavItem[] = [
  { icon: <DatabaseIcon className="size-6" />, key: "system", path: "/system" },
  { icon: <ListIcon className="size-6" />, key: "logs", path: "/logs" },
];

export const unusedIcons = { TaskIcon };
