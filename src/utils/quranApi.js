// Quran API utility using Al-Quran API
const API_BASE_URL = 'https://api.alquran.cloud/v1'

export const getAllSurahs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/surah`)
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching surahs:', error)
    return []
  }
}

export const getSurah = async (surahNumber) => {
  try {
    const response = await fetch(`${API_BASE_URL}/surah/${surahNumber}`)
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching surah:', error)
    return null
  }
}

export const getAyah = async (surahNumber, ayahNumber) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ayah/${surahNumber}:${ayahNumber}`)
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching ayah:', error)
    return null
  }
}

// Get ayahs by Mushaf page number (604 pages total)
export const getPage = async (pageNumber) => {
  try {
    const response = await fetch(`${API_BASE_URL}/page/${pageNumber}`)
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching page:', error)
    return null
  }
}

// Get ayahs by Mushaf juz number (30 juzs total)
export const getJuz = async (juzNumber) => {
  try {
    const response = await fetch(`${API_BASE_URL}/juz/${juzNumber}`)
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching juz:', error)
    return null
  }
}

