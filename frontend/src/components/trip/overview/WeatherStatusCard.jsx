import {
  useEffect,
  useState
}
from "react";

import {
  weatherService
}
from "../../../services/weatherService";

import {
  CloudSun,
  AlertTriangle,
  Wind
}
from "lucide-react";

const WeatherStatusCard = ({
  trip
}) => {

  const [
    weather,
    setWeather
  ] = useState(null);

  const [
    showWeather,
    setShowWeather
  ] = useState(false);

  useEffect(() => {

    const startDate =
      new Date(
        trip.startDate
      );

    const today =
      new Date();

    const daysUntilTrip =
      Math.ceil(
        (
          startDate -
          today
        ) /
        (
          1000 *
          60 *
          60 *
          24
        )
      );

const tripStarted =
  today >=
  new Date(
    trip.startDate
  );


const shouldShow =
  tripStarted ||
  daysUntilTrip <= 3;

    setShowWeather(
      shouldShow
    );

    if (
      !shouldShow
    ) return;

    const load =
    async () => {

      try {

        const response =
          await weatherService
            .getWeather(
              trip._id
            );

        setWeather(
          response
        );

      } catch (error) {

        console.log(error);

      }

    };

    load();

  }, [trip]);

  useEffect(() => {

  const scrollTarget =
    localStorage.getItem(
      "scrollToWeather"
    );

  if (
    scrollTarget === "true"
  ) {

    setActiveTab(
      "Overview"
    );

    setTimeout(() => {

      document
        .getElementById(
          "weather-section"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

    }, 300);

    localStorage.removeItem(
      "scrollToWeather"
    );
  }

}, [trip]);

  if (!showWeather) {

    return (

      <div
        className="
        bg-white
        border
        border-gray-200/60
        rounded-2xl
        p-6
        "
      >

        <h3
          className="
          text-xs
          uppercase
          tracking-widest
          font-bold
          text-gray-400
          mb-5
          "
        >
          Trip Weather
        </h3>

        <div
          className="
          text-center
          py-8
          "
        >

          <CloudSun
            size={28}
            className="
            mx-auto
            text-gray-300
            "
          />

          <p
            className="
            mt-3
            text-sm
            text-gray-500
            "
          >
            Forecast available
            3 days before departure
          </p>

        </div>

      </div>

    );

  }


  return (

   <div
  id="weather-section"
  className="
  bg-white
  border
  border-gray-200/60
  rounded-2xl
  p-6
  "
>

      <h3
        className="
        text-xs
        uppercase
        tracking-widest
        font-bold
        text-gray-400
        mb-5
        "
      >
        Trip Weather
      </h3>

       {weather &&
 weather.alerts?.length > 0 && (

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
      gap-3
      "
    >

      <AlertTriangle
        size={20}
        className="
        text-red-500
        flex-shrink-0
        "
      />

      <div>

        <p
          className="
          text-[10px]
          uppercase
          tracking-widest
          font-bold
          text-gray-400
          "
        >
          Weather Alert
        </p>

        <p
          className="
          text-sm
          font-medium
          text-gray-900
          mt-1
          "
        >
          {trip.destination}
        </p>

      </div>

    </div>

  </div>

)}

      {weather && (

        <>

          <div
            className="
            flex
            items-center
            gap-3
            "
          >

            <img
              src={weather.current.icon}
              alt=""
              className="w-14 h-14"
            />

            <div>

              <h2
  className="
  text-3xl
  font-bold
  "
>
  {
  Math.round(
    weather.current.temperature
  )
}°
</h2>

              <p
                className="
                text-sm
                text-gray-500
                "
              >
                {
                  weather.current
                    .condition
                }
              </p>

            </div>

          </div>

          <div
  className="
  mt-5
  space-y-3
  text-sm
  "
>

  <div
  className="
  flex
  justify-between
  text-gray-600
  "
>
  <span>Feels Like</span>

  <span>
    {
  Math.round(
    weather.current.feelsLike
  )
}°
  </span>
</div>

  <div
    className="
    flex
    justify-between
    text-gray-600
    "
  >
    <span>Humidity</span>

    <span>
      {
        weather.current
          .humidity
      }%
    </span>
  </div>

  <div
    className="
    flex
    justify-between
    text-gray-600
    "
  >
    <span>Wind</span>

    <span>
      {
        weather.current
          .windSpeed
      }
      km/h
    </span>
  </div>

</div>

        
        </>

      )}

    </div>

  );

};

export default WeatherStatusCard;