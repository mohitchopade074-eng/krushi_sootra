// KRUSHI-SOOTRA (कृषी-सूत्र / कृषि-सूत्र)
// Zero-Cost Weather Intelligence & Agro-Advisory Engine (Open-Meteo API)
// 100% Pure Multilingual Translation Support (Marathi, Hindi, English)

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

// WMO Weather code interpretations with pure language isolation
const WEATHER_CODES = {
  0: { labelMr: 'स्वच्छ आकाश', labelHi: 'साफ आसमान', labelEn: 'Clear Sky', icon: 'sunny' },
  1: { labelMr: 'मुख्यतः निरभ्र', labelHi: 'मुख्यतः साफ', labelEn: 'Mainly Clear', icon: 'partly-sunny' },
  2: { labelMr: 'अंशतः ढगाळ', labelHi: 'आंशिक बादल', labelEn: 'Partly Cloudy', icon: 'partly-sunny' },
  3: { labelMr: 'ढगाळ वातावरण', labelHi: 'घने बादल', labelEn: 'Overcast', icon: 'cloudy' },
  45: { labelMr: 'धुके', labelHi: 'कोहरा', labelEn: 'Fog', icon: 'cloud' },
  48: { labelMr: 'दाट धुके', labelHi: 'घना कोहरा', labelEn: 'Dense Fog', icon: 'cloud' },
  51: { labelMr: 'हलकी रिमझिम', labelHi: 'हल्की बूंदाबांदी', labelEn: 'Light Drizzle', icon: 'rainy' },
  53: { labelMr: 'रिमझिम पाऊस', labelHi: 'मध्यम बूंदाबांदी', labelEn: 'Moderate Drizzle', icon: 'rainy' },
  55: { labelMr: 'दाट रिमझिम', labelHi: 'तेज बूंदाबांदी', labelEn: 'Dense Drizzle', icon: 'rainy' },
  61: { labelMr: 'हलका पाऊस', labelHi: 'हल्की बारिश', labelEn: 'Slight Rain', icon: 'rainy' },
  63: { labelMr: 'मध्यम पाऊस', labelHi: 'मध्यम बारिश', labelEn: 'Moderate Rain', icon: 'rainy' },
  65: { labelMr: 'मुसळधार पाऊस', labelHi: 'भारी बारिश', labelEn: 'Heavy Rain', icon: 'thunderstorm' },
  80: { labelMr: 'पावसाची सर', labelHi: 'बारिश की बौछारें', labelEn: 'Rain Showers', icon: 'rainy' },
  81: { labelMr: 'जोरदार सरी', labelHi: 'तेज बौछारें', labelEn: 'Moderate Showers', icon: 'thunderstorm' },
  82: { labelMr: 'अति मुसळधार सरी', labelHi: 'मूसलाधार बौछारें', labelEn: 'Violent Showers', icon: 'thunderstorm' },
  95: { labelMr: 'वादळी पाऊस व विजा', labelHi: 'तूफानी बारिश और बिजली', labelEn: 'Thunderstorm', icon: 'thunderstorm' },
};

/**
 * Generate actionable, farmer-specific agricultural advisory based on live weather data
 */
export function generateAgroAdvisory(current, daily, language = 'mr') {
  const temp = current?.temperature_2m ?? 28;
  const rainProb = daily?.precipitation_probability_max?.[0] ?? 10;
  const windSpeed = current?.wind_speed_10m ?? 12;
  const humidity = current?.relative_humidity_2m ?? 55;

  let advice = '';
  let alertTitle = '';
  let alertType = 'info';

  if (rainProb >= 60) {
    alertType = 'warning';
    if (language === 'mr') {
      alertTitle = 'पावसाचा इशारा';
      advice = 'आज पाऊस पडण्याची शक्यता जास्त आहे. रासायनिक फवारणी व खते देणे तात्काळ टाळा. शेतात पाण्याचा निचरा व्यवस्थित ठेवा.';
    } else if (language === 'hi') {
      alertTitle = 'बारिश की चेतावनी';
      advice = 'आज बारिश की संभावना अधिक है। कीटनाशक छिड़काव और खाद डालना स्थगित करें। जल निकासी की उचित व्यवस्था रखें।';
    } else {
      alertTitle = 'Rain Alert';
      advice = 'High probability of rain today. Postpone pesticide spraying and fertilizer application. Ensure proper field drainage.';
    }
  } else if (windSpeed >= 22) {
    alertType = 'warning';
    if (language === 'mr') {
      alertTitle = 'वेगाने वाहणारे वारे';
      advice = 'वार्याचा वेग जास्त असल्याने ड्रोन किंवा स्प्रे गनने फवारणी करू नका. औषधाचा अपव्यय टळेल.';
    } else if (language === 'hi') {
      alertTitle = 'तेज हवा की चेतावनी';
      advice = 'हवा की गति अधिक होने के कारण ड्रोन या स्प्रेयर से छिड़काव न करें। दवा का अपव्यय रुकेगा।';
    } else {
      alertTitle = 'High Wind Warning';
      advice = 'High wind speeds detected. Avoid drone or aerial spraying to prevent chemical drift.';
    }
  } else if (temp >= 38) {
    alertType = 'caution';
    if (language === 'mr') {
      alertTitle = 'उष्णतेची लाट';
      advice = 'दुपारच्या कडक उन्हात पिकांना पाणी देऊ नका. पिकांना संध्याकाळी किंवा सकाळी लवकर हलके पाणी (ठिबक) द्या.';
    } else if (language === 'hi') {
      alertTitle = 'लू और तेज धूप की सावधानी';
      advice = 'दोपहर की तेज धूप में सिंचाई न करें। सुबह जल्दी या शाम को ड्रिप द्वारा हल्की सिंचाई करें।';
    } else {
      alertTitle = 'Heat Wave Precaution';
      advice = 'Avoid midday irrigation. Provide light drip irrigation during early morning or late evening.';
    }
  } else if (humidity >= 85 && temp >= 24) {
    alertType = 'caution';
    if (language === 'mr') {
      alertTitle = 'बुरशीजन्य रोगांचा धोका';
      advice = 'हवेतील उच्च आर्द्रतेमुळे करपा किंवा तांबेरा रोगाचा प्रादुर्भाव वाढू शकतो. पिकांचे नियमित निरीक्षण करा.';
    } else if (language === 'hi') {
      alertTitle = 'फंगल रोग का खतरा';
      advice = 'हवा में अधिक नमी के कारण झुलसा या रतुआ रोग का प्रकोप बढ़ सकता है। फसल का नियमित निरीक्षण करें।';
    } else {
      alertTitle = 'Fungal Disease Risk';
      advice = 'High humidity and warm temperatures increase fungal risk. Regularly inspect crop foliage for blights or rust.';
    }
  } else {
    alertType = 'success';
    if (language === 'mr') {
      alertTitle = 'मशागतीसाठी अनुकूल वातावरण';
      advice = 'आज हवामान शांत व अनुकूल आहे. आंतरमशागत, खुरपणी, खत व्यवस्थापन आणि फवारणीसाठी योग्य दिवस.';
    } else if (language === 'hi') {
      alertTitle = 'कृषि कार्यों हेतु अनुकूल मौसम';
      advice = 'आज मौसम शांत और अनुकूल है। निराई-गुड़ाई, खाद प्रबंधन और छिड़काव के लिए उपयुक्त दिन है।';
    } else {
      alertTitle = 'Favorable Conditions';
      advice = 'Ideal conditions for field operations, weeding, fertilizer application, and scheduled spraying.';
    }
  }

  return {
    alertType,
    title: alertTitle,
    message: advice,
    temp,
    rainProb,
    windSpeed,
    humidity,
  };
}

/**
 * Fetch real-time weather and 3-day forecast from Open-Meteo
 */
export async function fetchLiveWeatherData(latitude = 18.5204, longitude = 73.8567, language = 'mr') {
  const url = `${BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max&timezone=auto&forecast_days=3`;

  try {
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Open-Meteo API returned status ${response.status}`);
    }

    const data = await response.json();
    const current = data.current;
    const daily = data.daily;
    const weatherCode = current?.weather_code ?? 0;
    const weatherMeta = WEATHER_CODES[weatherCode] || WEATHER_CODES[0];

    const conditionName =
      language === 'hi'
        ? weatherMeta.labelHi
        : language === 'en'
        ? weatherMeta.labelEn
        : weatherMeta.labelMr;

    const advisory = generateAgroAdvisory(current, daily, language);

    return {
      success: true,
      current: {
        temperature: Math.round(current?.temperature_2m ?? 28),
        apparentTemperature: Math.round(current?.apparent_temperature ?? 28),
        humidity: current?.relative_humidity_2m ?? 50,
        windSpeed: Math.round(current?.wind_speed_10m ?? 10),
        weatherCode,
        conditionName,
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
    console.warn('Weather fetch fallback:', error?.message);

    const conditionFallback =
      language === 'hi'
        ? 'साफ एवं अनुकूल'
        : language === 'en'
        ? 'Clear & Favorable'
        : 'स्वच्छ व अनुकूल';

    const fallbackCurrent = {
      temperature: 30,
      apparentTemperature: 31,
      humidity: 55,
      windSpeed: 12,
      weatherCode: 1,
      conditionName: conditionFallback,
      icon: 'partly-sunny',
    };

    const fallbackAdvisory = generateAgroAdvisory(
      fallbackCurrent,
      { precipitation_probability_max: [10] },
      language
    );

    return {
      success: false,
      isFallback: true,
      current: fallbackCurrent,
      advisory: fallbackAdvisory,
    };
  }
}
