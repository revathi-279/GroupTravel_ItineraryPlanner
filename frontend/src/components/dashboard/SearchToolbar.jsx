import { theme } from "../../common/common";

const SearchToolbar = ({
  search,
  setSearch,
   onCreateTrip,
}) => {

  return (

    <div
      className="
      flex
      flex-col
      md:flex-row
      gap-4
      justify-between
      "
    >

      <input
        type="text"
        placeholder="Search trips or destinations..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        className={
          theme.inputs.search
        }
      />

     <button
  onClick={onCreateTrip}
  className={`
    ${theme.buttons.primary}
    px-6
    py-3
    rounded-2xl
    whitespace-nowrap
  `}
>
  + Create Journey
</button>

    </div>
  );
};

export default SearchToolbar;