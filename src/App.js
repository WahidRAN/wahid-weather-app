import Search from "./components/search-location/search";
import CurrentWeather from "./components/current-weather/current-weather";
import Forecast from "./components/forecast-weather/forecast";
import { useState } from "react";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./api";
import "./App.css";

function App() {
	const [currentWeather, setCurrentWeather] = useState(null);
	const [forecast, setForecast] = useState(null);

	if(!navigator.geolocation) {
    return
  } else {
    navigator.geolocation.getCurrentPosition((position) => {
			// console.log(position)
		});
  }

	const handleOnSearchChange = (searchData) => {
		// console.log(searchData);
		const [lat, lon] = searchData.value.split(" ");

		const currentWeatherFetch = fetch(
			`${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
		);
		const forecastFetch = fetch(
			`${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
		);

		Promise.all([currentWeatherFetch, forecastFetch]).then(async (response) => {
			const weatherResponse = await response[0].json();
			const forecastResponse = await response[1].json();

			setCurrentWeather({city: searchData.label, ...weatherResponse});
			setForecast({city: searchData.label, ...forecastResponse});
		})
    .catch((err) => console.log(err));
	};

	return (
		<div className="container">
			<Search onSearchChange={handleOnSearchChange} />
			{currentWeather && <CurrentWeather data={currentWeather} />}
      {forecast && <Forecast data={forecast} />}
		</div>
	);
}

export default App;
