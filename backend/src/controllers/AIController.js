import { GoogleGenerativeAI }
from "@google/generative-ai";

import Trip
from "../models/TripModel.js";

import Itinerary
from "../models/ItineraryModel.js";

import axios
from "axios";

const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );

export const getTripInsights =
async (req, res) => {

  try {

    const forceRefresh =
  req.method === "POST";

    const { tripId } =
      req.params;

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

    const sixHours =
      1000 *
      60 *
      60 *
      6;

    if (
  !forceRefresh &&
  trip.aiInsights &&
  trip.aiInsightsUpdatedAt &&
  Date.now() -
  new Date(
    trip.aiInsightsUpdatedAt
  ).getTime() <
  sixHours
) {

      return res.status(200).json({
        success: true,
        insights:
          JSON.parse(
            trip.aiInsights
          )
      });

    }

    const weatherResponse =
      await axios.get(
        "http://api.weatherapi.com/v1/current.json",
        {
          params: {
            key:
              process.env
                .WEATHER_API_KEY,
            q:
              trip.destination
          }
        }
      );

    const weather =
      weatherResponse.data;

   

    const model =
      genAI.getGenerativeModel({
        model:
          "gemini-2.5-flash"
      });

      const itineraries =
  await Itinerary.find({
    tripId
  })
  .sort({
    dateTime: 1
  });

      const itineraryText =
  itineraries
    .slice(0, 5)
    .map(
      item =>
        `- ${item.title} at ${item.location}`
    )
    .join("\n");



    
const prompt = `
You are an intelligent travel planner.

Trip Details:

Destination:
${trip.destination}

Trip Title:
${trip.title}

Trip Dates:
${trip.startDate} to ${trip.endDate}

Group Size:
${trip.members.length}

Budget:
${trip.budget || "Not specified"}

Weather:
${weather.current.condition.text}

Temperature:
${weather.current.temp_c}°C

Upcoming Itinerary Events:
${itineraryText}


Generate exactly 4 travel insights.

Rules:

- Title maximum 4 words.
- Description maximum 12 words.
- One sentence only.
- No paragraphs.
- Use itinerary events.
- Use weather.
- Use destination.
- Use group size if relevant.
- Avoid generic advice.
- Keep insights concise for a dashboard card.

Return ONLY valid JSON.

Rules:

- Every section must contain at least 3 items.
- Never return empty strings.
- Never return empty arrays.
- Use destination specific recommendations.
- Use weather information.
- Use itinerary information.
- Do not generate spiritual advice.
- Do not generate motivational advice.
- Focus only on travel planning.

Example:

{
  "quickInsights":[
    {
      "title":"Heat Alert",
      "description":"Carry water during afternoon sightseeing."
    }
  ],

  "detailedInsights":{
    "places":[
      "Recommended place 1",
      "Recommended place 2",
      "Recommended place 3"
    ],

    "food":[
      "Food recommendation 1",
      "Food recommendation 2",
      "Food recommendation 3"
    ],

    "packing":[
      "Packing tip 1",
      "Packing tip 2",
      "Packing tip 3"
    ],

    "weather":[
      "Weather note 1",
      "Weather note 2",
      "Weather note 3"
    ],

    "warnings":[
      "Travel warning 1",
      "Travel warning 2",
      "Travel warning 3"
    ]
  }
}
`;

    const result =
      await model.generateContent(
        prompt
      );

     const text =
  result.response
    .text()
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

let insights;

try {

  insights = JSON.parse(text);

} catch {

  insights = {

    quickInsights: [
      {
        title: "Trip Planning",
        description:
          "No AI insights available right now."
      }
    ],

    detailedInsights: {
      places: [],
      food: [],
      packing: [],
      weather: [],
      warnings: []
    }

  };

}


    trip.aiInsights =
      JSON.stringify(
        insights
      );

    trip.aiInsightsUpdatedAt =
      new Date();

    await trip.save();

    return res.status(200).json({
      success: true,
      insights
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message:
        "Unable to generate insights"
    });

  }

};