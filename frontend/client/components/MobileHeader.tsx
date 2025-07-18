import React from "react";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuClick }) => {
  return (
    <div className="lg:hidden  top-0 left-0 right-0 h-16 bg-white border-b border-boviclouds-gray-200 flex items-center justify-between px-4 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 text-boviclouds-gray-700 hover:bg-boviclouds-gray-100 rounded-md transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-boviclouds-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">B</span>
          </div>
          <span className="text-lg font-poppins font-semibold text-gray-900">
            boviclouds
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 text-boviclouds-gray-700 hover:bg-boviclouds-gray-100 rounded-md transition-colors">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-5 5c-3.33 0-6-2.67-6-6v-5h5v6z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MobileHeader;
