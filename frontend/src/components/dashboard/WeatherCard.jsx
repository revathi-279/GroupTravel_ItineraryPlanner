import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Wind,
  AlertTriangle
}
from "lucide-react";

import { useNavigate } from "react-router-dom";

const WeatherCard = ({
  weather,
   tripId
}) => {

  // const getIcon = () => {

  //   const condition =
  //     weather?.current?.condition
  //       ?.toLowerCase();

  //   if (
  //     condition?.includes("rain")
  //   ) {
  //     return (
  //       <CloudRain
  //         size={22}
  //       />
  //     );
  //   }

  //   if (
  //     condition?.includes(
  //       "thunder"
  //     )
  //   ) {
  //     return (
  //       <CloudLightning
  //         size={22}
  //       />
  //     );
  //   }

  //   if (
  //     condition?.includes(
  //       "cloud"
  //     )
  //   ) {
  //     return (
  //       <Cloud
  //         size={22}
  //       />
  //     );
  //   }

  //   return (
  //     <Sun size={22} />
  //   );
  // };

  const navigate = useNavigate();

  const hasAlert =
    weather?.alerts?.length > 0;

  return (

    <div
      className="
      bg-white
      border
      border-gray-200/60
      rounded-3xl
      p-5
      h-full
      flex
      flex-col
      "
    >

      <div>

          {hasAlert && (

  <div
   className="
mb-5
pb-4
border-b
border-red-100
"
  >

    <div
  className="
  flex
  items-end
  justify-between
  gap-4
  "
>

      <AlertTriangle
  size={22}
  className="
  text-red-500
  flex-shrink-0
  mt-0.5
  "
/>

      <div className="flex-1">

  <p
    className="
    text-[10px]
    uppercase
    tracking-widest
    font-bold
    text-red-600
    "
  >
    Weather Alert
  </p>

  <h4
    className="
    text-sm
    font-semibold
    text-gray-900
    mt-1
    "
  >
    {weather.destination}
  </h4>

</div>


    </div>

  </div>

)}


        <div
  className="
  flex
  items-center
  justify-between
  gap-4
  "
>

          <h3
            className="
            text-xs
            uppercase
            tracking-widest
            font-bold
            text-gray-400
            "
          >
            Weather
          </h3>

          {/* {getIcon()} */}

         <img
  src={weather.current.icon}
  alt=""
  className="
  w-14
  h-14
  object-contain
  "
/>
        </div>

        <h2
          className="
          text-4xl
          font-bold
          mt-1
          "
        >
          {Math.round(
            weather.current.temperature
          )}°
        </h2>

        <p
          className="
          text-sm
          text-gray-600
          mt-2
          "
        >
          {weather.current.condition}
        </p>

      </div>
      <button
  onClick={() => {

     navigate(
      `/trip/${tripId}`
    );

  }}
  className="
  mt-6
  self-end
  text-sm
  font-medium
  text-[#2F6F4E]
  hover:underline
  "
>
  View Details →
</button>

      


    </div>

  );
};

export default WeatherCard;