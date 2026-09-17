// KRUSHI-SOOTRA (कृषी-सूत्र)
// Zero-Cost Weather Intelligence & Agro-Advisory Engine (Open-Meteo API)
// Free, no API keys required, rate-limit friendly

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

// WMO Weather code interpretations in Marathi and English
const WEATHER_CODES = {
  0: { labelMr: 'स्वच्छ आकाश', labelEn: 'Clear sky', icon: 'sunny' },
  1: { labelMr: 'मुख्यतः निरभ्र', labelEn: 'Mainly clear', icon: 'partly-sunny' },
  2: { labelMr: 'अंशतः ढगाळ', labelEn: 'Partly cloudy', icon: 'partly-sunny' },
  3: { labelMr: 'ढगाळ वातावरण', labelEn: 'Overcast', icon: 'cloudy' },
  45: { labelMr: 'धुके', labelEn: 'Fog', icon: 'cloud' },
  48: { labelMr: 'दाट धुके', labelEn: 'Depositing rime fog', icon: 'cloud' },
  51: { labelMr: 'हलकी रिमझिम', labelEn: 'Light drizzle', icon: 'rainy' },
  53: { labelMr: 'रिमझिम पाऊस', labelEn: 'Moderate drizzle', icon: 'rainy' },
  55: { labelMr: 'दाट रिमझिम', labelEn: 'Dense drizzle', icon: 'rainy' },
  61: { labelMr: 'हलका पाऊस', labelEn: 'Slight rain', icon: 'rainy' },
  63: { labelMr: 'मध्यम पाऊस', labelEn: 'Moderate rain', icon: 'rainy' },
  65: { labelMr: 'मुसळधार पाऊस', labelEn: 'Heavy rain', icon: 'thunderstorm' },
  80: { labelMr: 'पावसाची सर', labelEn: 'Rain showers', icon: 'rainy' },
  81: { labelMr: 'जोरदार सरी', labelEn: 'Moderate showers', icon: 'thunderstorm' },
  82: { labelMr: 'अति मुसळधार सरी', labelEn: 'Violent showers', icon: 'thunderstorm' },
  95: { labelMr: 'वादळी पाऊस / विजा', labelEn: 'Thunderstorm', icon: 'thunderstorm' },
};

/**
 * Generate actionable, farmer-specific agricultural advisory based on live weather data
 */
export function generateAgroAdvisory(current, daily, language = 'mr') {
  const temp = current?.temperature_2m ?? 28;
  const rainProb = daily?.precipitation_probability_max?.[0] ?? 10;
  const windSpeed = current?.wind_speed_10m ?? 12;
  const humidity = current?.relative_humidity_2m ?? 55;

  let adviceMr = '';
  let adviceEn = '';
  let alertType = 'info'; // 'info' | 'warning' | 'success' | 'caution'
  let alertTitleMr = 'कृषी सल्ला';
  let alertTitleEn = 'Agro Advisory';

  if (rainProb >= 60) {
    alertType = 'warning';
    alertTitleMr = 'पावसाचा इशारा (सावध राहा)';
    alertTitleEn = 'Rain Alert';
    adviceMr = 'आज पाऊस पडण्याची शक्यता जास्त आहे. रासायनिक फवारणी व खते देणे तात्काळ टाळा. पाण्याचा निचरा व्यवस्थित ठेवा.';
    adviceEn = 'High probability of rain today. Postpone pesticide spraying and fertilizer application. Ensure proper drainage.';
  } else if (windSpeed >= 22) {
    alertType = 'warning';
    alertTitleMr = 'वेगाने वाहणारे वारे';
    alertTitleEn = 'High Wind Speed';
    adviceMr = 'वार्याचा वेग जास्त असल्याने ड्रोन किंवा स्प्रे गनने फवारणी करू नका. औषधाचा अपव्यय टळेल.';
    adviceEn = 'High wind speeds detected. Avoid drone or aerial spraying to prevent chemical drift.';
  } else if (temp >= 38) {
    alertType = 'caution';
    alertTitleMr = 'उष्णतेची लाट';
    alertTitleEn = 'Heat Wave Precaution';
    adviceMr = 'दुपारच्या कडक उन्हात पिकांना पाणी देऊ नका. पिकांना संध्याकाळी किंवा सकाळी लवकर हलके पाणी (ठिबक) द्या.';
    adviceEn = 'Avoid midday irrigation. Provide light drip irrigation during early morning or late evening.';
  } else if (humidity >= 85 && temp >= 24) {
    alertType = 'caution';
    alertTitleMr = 'बुरशीजन्य रोगांचा धोका';
    alertTitleEn = 'Fungal Disease Risk';
    adviceMr = 'हवेतील उच्च आर्द्रतेमुळे करपा किंवा तांबेरा रोगाचा प्रादुर्भाव वाढू शकतो. पिकांचे नियमित निरीक्षण करा.';
    adviceEn = 'High humidity and warm temperatures increase fungal risk. Monitor leaves for blights or rust.';
  } else {
    alertType = 'success';
    alertTitleMr = 'फवारणी व मशागतीसाठी अनुकूल';
    alertTitleEn = 'Favorable Conditions';
    adviceMr = 'आज हवामान शांत व अनुकूल आहे. आंतरमशागत, खुरपणी, खत व्यवस्थापन आणि कीटकनाशक फवारणीसाठी योग्य दिवस.';
    adviceEn = 'Ideal conditions for field operations, weeding, fertilizer application, and scheduled spraying.';
  }

  return {
    alertType,
    title: language === 'mr' ? alertTitleMr : alertTitleEn,
    message: language === 'mr' ? adviceMr : adviceEn,
    temp,
    rainProb,
    windSpeed,
    humidity,
  };
}

/**
 * Fetch real-time weather and 3-day forecast from Open-Meteo
 * @param {number} latitude Default: Pune (18.5204)
 * @param {number} longitude Default: Pune (73.8567)
 */
export async function fetchLiveWeatherData(latitude = 18.5204, longitude = 73.8567, language = 'mr') {
  const url = `${BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max&timezone=auto&forecast_days=3`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Open-Meteo API returned status ${response.status}`);
    }

    const data = await response.json();
    const current = data.current;
    const daily = data.daily;
    const weatherCode = current?.weather_code ?? 0;
    const weatherMeta = WEATHER_CODES[weatherCode] || WEATHER_CODES[0];

    const advisory = generateAgroAdvisory(current, daily, language);

    return {
      success: true,
      current: {
        temperature: Math.round(current?.temperature_2m ?? 28),
        apparentTemperature: Math.round(current?.apparent_temperature ?? 28),
        humidity: current?.relative_humidity_2m ?? 50,
        windSpeed: Math.round(current?.wind_speed_10m ?? 10),
        weatherCode,
        conditionName: language === 'mr' ? weatherMeta.labelMr : weatherMeta.labelEn,
        icon: weatherMeta.icon,
      },
      forecast: daily?.time?.map((dateStr, idx) => ({
        date: dateStr,
        tempMax: Math.round(daily.temperature_2m_max[idx]),
        tempMin: Math.round(daily.temperature_2m_min[idx]),
        rainProb: daily.precipitation_probability_max[idx] ?? 0,
        weatherCode: daily.weather_code[idx] ?? 0,
      })) || [],
      advisory,
    };
  } catch (error) {
    console.warn('Weather fetch failed, utilizing resilient offline fallback:', error?.message);
    
    // Resilient offline fallback with authentic regional norms
    const fallbackCurrent = {
      temperature: 30,
      apparentTemperature: 31,
      humidity: 55,
      windSpeed: 12,
      weatherCode: 1,
      conditionName: language === 'mr' ? 'स्वच्छ व अनुकूल' : 'Clear & Favorable',
      icon: 'partly-sunny',
    };
    
    const fallbackAdvisory = generateAgroAdvisory(fallbackCurrent, { precipitation_probability_max: [10] }, language);

    return {
      success: false,
      isFallback: true,
      current: fallbackCurrent,
      forecast: [
        { date: 'आज', tempMax: 32, tempMin: 22, rainProb: 15, weatherCode: 1 },
        { date: 'उद्या', tempMax: 31, tempMin: 21, rainProb: 20, weatherCode: 2 },
        { date: 'परवा', tempMax: 33, tempMin: 23, rainProb: 10, weatherCode: 0 },
      ],
      advisory: fallbackAdvisory,
    };
  }
}
