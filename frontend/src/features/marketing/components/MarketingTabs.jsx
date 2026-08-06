import React from "react";
import TabButton from "./TabButton";

export const TABS = [
  {
    key: "customer",
    label: "Customer",
  },
  {
    key: "consignee",
    label: "Consignee",
  },
];

const MarketingTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-slate-200 px-4 sm:px-5">
      <div className="flex gap-2 overflow-x-auto">
        {TABS.map((tab) => (
          <TabButton
            key={tab.key}
            active={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </TabButton>
        ))}
      </div>
    </div>
  );
};

export default MarketingTabs;
