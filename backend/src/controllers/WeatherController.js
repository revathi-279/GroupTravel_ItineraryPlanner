import axios from "axios";
import { Types } from "mongoose";
import Trip from "../models/TripModel.js";

export const getWeather =
async (req, res) => {

    try {

        const { tripId } =
            req.params;

        // Validate trip ID
        if (!tripId) {
            return res.status(400).json({
                success: false,
                message:
                    "Trip ID is required"
            });
        }

        if (
            !Types.ObjectId.isValid(
                tripId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter valid Trip ID"
            });
        }

        // Find trip
        const trip =
            await Trip.findById(
                tripId
            );

        if (!trip) {
            return res.status(404).json({
                success: false,
                message:
                    "Trip not found"
            });
        }

        const isMember =
    trip.members.some(
        member =>
            member.toString() ===
            req.user._id.toString()
    );

if (!isMember) {
    return res.status(403).json({
        success: false,
        message:
            "Only trip members can view weather"
    });
}

        const destination =
            trip.destination;

        const response =
            await axios.get(
                "http://api.weatherapi.com/v1/forecast.json",
                {
                    params: {
                        key:
                            process.env.WEATHER_API_KEY,
                        q:
                            destination,
                        days: 3,
                        alerts: "yes",
                        aqi: "yes"
                    }
                }
            );

        const data =
            response.data;

        return res.status(200).json({
            success: true,

            destination,

            current: {
                temperature:
                    data.current.temp_c,

                feelsLike:
                    data.current.feelslike_c,

                condition:
                    data.current.condition.text,

                icon:
                    data.current.condition.icon,

                humidity:
                    data.current.humidity,

                windSpeed:
                    data.current.wind_kph,

                airQuality:
                    data.current.air_quality
            },

            forecast:
                data.forecast.forecastday.map(
                    day => ({
                        date:
                            day.date,

                        maxTemp:
                            day.day.maxtemp_c,

                        minTemp:
                            day.day.mintemp_c,

                        condition:
                            day.day.condition.text,

                        icon:
                            day.day.condition.icon
                    })
                ),

            alerts:
                data.alerts.alert || []
        });

    } catch (error) {

        console.log(error?.response?.data || error);

        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch weather data"
        });
    }
};