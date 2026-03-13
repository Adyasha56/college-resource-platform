import {
  MessageCircle,
  HelpCircle,
  Trophy,
  BookOpen,
  Rocket,
} from "lucide-react";

export const postTypes = [
  { id: "all", label: "All", icon: null, color: "gray" },
  { id: "discussion", label: "Discussion", icon: MessageCircle, color: "blue" },
  { id: "question", label: "Question", icon: HelpCircle, color: "orange" },
  { id: "achievement", label: "Achievement", icon: Trophy, color: "yellow" },
  { id: "resource", label: "Resource", icon: BookOpen, color: "green" },
  { id: "project", label: "Project", icon: Rocket, color: "purple" },
];

export const colorClasses = {
  gray: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700",
  blue: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700",
  orange: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700",
  yellow: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700",
  green: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700",
  purple: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700",
};

export const activeColorClasses = {
  gray: "bg-blue-600 text-white",
  blue: "bg-blue-600 text-white",
  orange: "bg-blue-600 text-white",
  yellow: "bg-blue-600 text-white",
  green: "bg-blue-600 text-white",
  purple: "bg-blue-600 text-white",
};

export const getPostTypeInfo = (type) => {
  return postTypes.find(t => t.id === type) || postTypes[0];
};

export const getPostTypeBadgeClasses = (type) => {
  const info = getPostTypeInfo(type);
  return colorClasses[info.color];
};
