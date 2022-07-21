import React, { useState } from "react";

type ChildrenType = {
  children: JSX.Element;
};

type TabButtonType = {
  activeTab: string;
  label: string;
  onClick: () => void;
};

export const Tab = ({ children }: ChildrenType): JSX.Element => children;

export const Tabs = ({ children }: ChildrenType): JSX.Element => {
  const [activeTab, setActiveTab] = useState(children[0].props.label);

  return (
    <div>
      <ul style={{ listStyleType: "none", padding: 0, display: "flex", marginBottom: 20 }}>
        {children.map((child) => {
          const { label } = child.props;
          return (
            <TabButton activeTab={activeTab} key={label} label={label} onClick={setActiveTab} />
          );
        })}
      </ul>
      <div>
        {children.map((child) => {
          if (child.props.label !== activeTab) {
            return;
          }
          return child.props.children;
        })}
      </div>
    </div>
  );
};

export const TabButton = ({ activeTab, label, onClick }: TabButtonType): JSX.Element => {
  const handleClick = () => onClick(label);
  const isActive = activeTab === label;

  return (
    <li
      style={{
        borderBottom: isActive ? "3px solid #1EA7FD" : "3px solid #ddd",
        color: "#555770",
        fontFamily: "'Open Sans', sans-serif",
        fontWeight: "bold",
        cursor: "pointer",
        fontSize: 20,
        marginRight: 20,
        paddingBottom: 6,
      }}
      onClick={handleClick}
    >
      {label}
    </li>
  );
};
