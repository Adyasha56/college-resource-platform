import {
  postTypes,
  colorClasses,
  activeColorClasses,
} from "../../utils/postTypeUtils";

const PostTypeFilter = ({ activeType, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {postTypes.map((type) => {
        const isActive = activeType === type.id;
        const Icon = type.icon;
        
        return (
          <button
            key={type.id}
            onClick={() => onChange(type.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              isActive ? activeColorClasses[type.color] : colorClasses[type.color]
            }`}
          >
            {type.emoji && <span>{type.emoji}</span>}
            {Icon && !type.emoji && <Icon className="w-4 h-4" />}
            {type.label}
          </button>
        );
      })}
    </div>
  );
};

export default PostTypeFilter;
