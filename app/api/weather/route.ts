import { NextResponse } from 'next/server'

export const revalidate = 1800 // cache 30 min

const WMO_DESCRIPTIONS: Record<number, string> = {
  0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Icy Fog',
  51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
  61: 'Light Rain', 63: 'Moderate Rain', 65: 'Heavy Rain',
  80: 'Rain Showers', 81: 'Rain Showers', 82: 'Violent Showers',
  95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm',
}

export async function GET() {
  try {
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=19.0760&longitude=72.8777&current_weather=true&hourly=relative_humidity_2m&forecast_days=1',
      { next: { revalidate: 1800 } }
    )
    const data = await res.json()
    const cw = data?.current_weather ?? {}
    const code: number = cw.weathercode ?? -1
    const temp: number = cw.temperature ?? 30
    const description = WMO_DESCRIPTIONS[code] ?? 'Cloudy'

    return NextResponse.json({ weathercode: code, temperature: Math.round(temp), description })
  } catch {
    return NextResponse.json({ weathercode: 3, temperature: 30, description: 'Cloudy' })
  }
}
