import { theme } from "../../common/common";

const tabs = [
  "Overview",
  "Itinerary",
  "Expenses",
  "Gallery",
  "Polls",
];

const TripTabs = ({
  activeTab,
  setActiveTab,
}) => {

  return (

    <div
      className={
        theme.tabs.trip
      }
    >

      {tabs.map((tab) => (

        <button
          key={tab}
          onClick={() =>
            setActiveTab(tab)
          }
          className={
            activeTab === tab
              ? `${theme.tabs.tab} ${theme.tabs.active}`
              : `${theme.tabs.tab} ${theme.tabs.inactive}`
          }
        >
          {tab}
        </button>

      ))}

    </div>
  );
};

export default TripTabs;