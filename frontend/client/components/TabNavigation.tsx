import React from "react";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: "eleveurs", label: "Eleveurs" },
    { id: "utilisateurs", label: "Utilisateurs" },
    { id: "exploitations", label: "Exploitations" },
  ];

  return (
    <div className="border-b border-boviclouds-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? "border-boviclouds-primary text-boviclouds-primary"
                : "border-transparent text-boviclouds-gray-500 hover:text-boviclouds-gray-700 hover:border-boviclouds-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabNavigation;
