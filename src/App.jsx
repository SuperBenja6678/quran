import { useState } from 'react'
import SurahList from './components/SurahList'
import AyahViewer from './components/AyahViewer'
import IslamicBackground from './components/IslamicBackground'
import ThemeToggle from './components/ThemeToggle'
import './App.css'

function App() {
  const [selectedSurah, setSelectedSurah] = useState(null)
  const [selectedAyah, setSelectedAyah] = useState(null)
  const [viewMode, setViewMode] = useState('list') // 'list' or 'reading'

  const handleSurahSelect = (surah) => {
    setSelectedSurah(surah)
    setSelectedAyah(null)
    setViewMode('list') // Reset to list view when selecting new surah
  }

  const handleAyahSelect = (ayah) => {
    setSelectedAyah(ayah)
  }

  const handleBack = () => {
    setSelectedSurah(null)
    setSelectedAyah(null)
    setViewMode('list')
  }

  return (
    <div className="app">
      <IslamicBackground />
      <header className={`app-header ${viewMode === 'reading' ? 'reading-mode-hidden' : ''}`}>
        <h1>Quran Reader</h1>
        <div className="header-actions">
          {selectedSurah && (
            <button onClick={handleBack} className="back-btn">
              ← Back to Surahs
            </button>
          )}
          <ThemeToggle />
        </div>
      </header>
      
      <main className={`app-main ${viewMode === 'reading' ? 'reading-mode' : ''}`}>
        {!selectedSurah ? (
          <SurahList onSelect={handleSurahSelect} />
        ) : (
          <AyahViewer
            surah={selectedSurah}
            selectedAyah={selectedAyah}
            onAyahSelect={handleAyahSelect}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        )}
      </main>
    </div>
  )
}

export default App

