import { useState, useEffect } from 'react'
import { getAllSurahs } from '../utils/quranApi'
import './SurahList.css'

function SurahList({ onSelect }) {
  const [surahs, setSurahs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchSurahs = async () => {
      setLoading(true)
      const data = await getAllSurahs()
      setSurahs(data)
      setLoading(false)
    }
    fetchSurahs()
  }, [])

  const filteredSurahs = surahs.filter(surah =>
    surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.number.toString().includes(searchTerm)
  )

  if (loading) {
    return <div className="loading">Loading surahs...</div>
  }

  return (
    <div className="surah-list-container">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search surahs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="surah-grid">
        {filteredSurahs.map((surah) => (
          <div
            key={surah.number}
            className="surah-card"
            onClick={() => onSelect(surah)}
          >
            <div className="surah-number">{surah.number}</div>
            <div className="surah-info">
              <div className="surah-name-arabic">{surah.name}</div>
              <div className="surah-name-english">{surah.englishName}</div>
              <div className="surah-meta">
                {surah.numberOfAyahs} ayahs • {surah.revelationType}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SurahList

