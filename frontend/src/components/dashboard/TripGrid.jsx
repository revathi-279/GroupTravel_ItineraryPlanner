import TripCard from "./TripCard";

const TripGrid = ({ trips }) => {

  return (

    <div
      className="
      grid
      grid-cols-1
      md:grid-cols-2
      xl:grid-cols-3
      gap-5
      "
    >

      {trips.map((trip) => (

        <TripCard
          key={trip._id}
          trip={trip}
        />

      ))}

    </div>
  );
};

export default TripGrid;