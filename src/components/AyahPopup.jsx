import { useState } from 'react'
import TafseerChat from './TafseerChat'
import './AyahPopup.css'

function AyahPopup({ ayah, surah, onClose, onStartTafseer }) {
  console.log('AyahPopup rendered with ayah:', ayah, 'surah:', surah)
  
  const handleTafseerClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    console.log('Tafseer button clicked! Calling onStartTafseer with ayah:', ayah)
    onStartTafseer(ayah)
  }
  
  return (
    <div className="ayah-popup-overlay" onClick={onClose}>
      <div className="ayah-popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="ayah-popup-header">
          <h3>{surah.englishName}</h3>
          <p>Ayah {ayah.numberInSurah}</p>
          <button className="popup-close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="ayah-popup-content">
          <div className="ayah-popup-text" dir="rtl">
            {ayah.text}
          </div>
        </div>

        <div className="ayah-popup-actions">
          <button className="tafseer-btn" onClick={handleTafseerClick}>
            💬 Get Tafseer Chat
          </button>
        </div>
      </div>
    </div>
  )
}

export default AyahPopup

