import {
  MessageCircle,
  HelpCircle,
  Trophy,
  BookOpen,
  Rocket,
} from "lucide-react";

export const postTypes = [
  { id: "all", label: "All", icon: null, color: "gray" },
  { id: "discussion", label: "Discussion", icon: MessageCircle, color: "blue", emoji: "💬" },
  { id: "question", label: "Question", icon: HelpCircle, color: "orange", emoji: "❓" },
  { id: "achievement", label: "Achievement", icon: Trophy, color: "yellow", emoji: "🎉" },
  { id: "resource", label: "Resource", icon: BookOpen, color: "green", emoji: "📚" },
  { id: "project", label: "Project", icon: Rocket, color: "purple", emoji: "🚀" },
];

export const colorClasses = {
  gray: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  blue: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  orange: "bg-orange-100 text-orange-700 hover:bg-orange-200",
  yellow: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
  green: "bg-green-100 text-green-700 hover:bg-green-200",
  purple: "bg-purple-100 text-purple-700 hover:bg-purple-200",
};

export const activeColorClasses = {
  gray: "bg-gray-600 text-white",
  blue: "bg-blue-600 text-white",
  orange: "bg-orange-500 text-white",
  yellow: "bg-yellow-500 text-white",
  green: "bg-green-600 text-white",
  purple: "bg-purple-600 text-white",
};

export const getPostTypeInfo = (type) => {
  return postTypes.find(t => t.id === type) || postTypes[0];
};

export const getPostTypeBadgeClasses = (type) => {
  const info = getPostTypeInfo(type);
  return colorClasses[info.color];
};
