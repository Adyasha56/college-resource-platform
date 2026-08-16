import {
  postTypes,
  colorClasses,
  activeColorClasses,
} from "../../utils/postTypeUtils";

const PostTypeFilter = ({ activeType, onChange }) => {
  return (
    <div className="relative">
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5 pr-6">
        {postTypes.map((type) => {
          const isActive = activeType === type.id;
          const Icon = type.icon;

          return (
            <button
              key={type.id}
              onClick={() => onChange(type.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                isActive ? activeColorClasses[type.color] : colorClasses[type.color]
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {type.label}
            </button>
          );
        })}
      </div>
      {/* Fade indicator for hidden scroll content */}
      <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white dark:from-slate-900 to-transparent pointer-events-none" />
    </div>
  );
};

export default PostTypeFilter;
