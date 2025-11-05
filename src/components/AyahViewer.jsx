import { useState, useEffect, useRef } from 'react'
import { getSurah, getPage } from '../utils/quranApi'
import { getTafseer } from '../utils/geminiApi'
import AyahPopup from './AyahPopup'
import TafseerChat from './TafseerChat'
import './AyahViewer.css'

function AyahViewer({ surah, selectedAyah, onAyahSelect, viewMode, onViewModeChange }) {
  const [ayahs, setAyahs] = useState([])
  const [loading, setLoading] = useState(true)
  const [tafseer, setTafseer] = useState(null)
  const [loadingTafseer, setLoadingTafseer] = useState(false)
  const [tafseerError, setTafseerError] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [chatAyah, setChatAyah] = useState(null)

  useEffect(() => {
    const fetchAyahs = async () => {
      setLoading(true)
      const data = await getSurah(surah.number)
      if (data && data.ayahs) {
        setAyahs(data.ayahs)
      }
      setLoading(false)
    }
    fetchAyahs()
  }, [surah.number])

  useEffect(() => {
    // Reset tafseer when ayah selection changes
    setTafseer(null)
    setTafseerError(null)
    // Only reset popup if we're not currently trying to show it
    // Don't reset showPopup here - let handleAyahClick control it
    // Don't reset showChat - keep chat open if user wants to continue
    // Only reset if it's a different ayah AND chat exists
    if (selectedAyah?.number && chatAyah?.number && selectedAyah.number !== chatAyah.number) {
      setShowChat(false)
      setChatAyah(null)
    }
  }, [selectedAyah?.number])

  const handleAyahClick = (ayah) => {
    console.log('handleAyahClick called with ayah:', ayah)
    onAyahSelect(ayah)
    // Use setTimeout to ensure selectedAyah is set before showing popup
    setTimeout(() => {
      setShowPopup(true)
      console.log('showPopup set to true')
    }, 0)
  }

  const handleStartTafseer = (ayah) => {
    console.log('handleStartTafseer called with ayah:', ayah)
    console.log('Current selectedAyah:', selectedAyah)
    console.log('Current chatAyah:', chatAyah)
    const ayahToUse = ayah || selectedAyah
    console.log('Setting chatAyah to:', ayahToUse)
    
    // Close popup first
    setShowPopup(false)
    
    // Set both states together - use a small delay to ensure state updates properly
    setTimeout(() => {
      setChatAyah(ayahToUse)
      setShowChat(true)
      console.log('State updated - showChat: true, chatAyah:', ayahToUse)
    }, 10)
  }

  if (loading) {
    return <div className="loading">Loading ayahs...</div>
  }

  return (
    <div className="ayah-viewer">
      {viewMode === 'list' && (
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => onViewModeChange('list')}
          >
            List View
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'reading' ? 'active' : ''}`}
            onClick={() => onViewModeChange('reading')}
          >
            Reading View
          </button>
        </div>
      )}

      {viewMode === 'list' ? (
        <>
          <div className="surah-header">
            <h2 className="surah-title-arabic">{surah.name}</h2>
            <h3 className="surah-title-english">{surah.englishName}</h3>
            <p className="surah-translation">{surah.englishNameTranslation}</p>
            <div className="surah-info-bar">
              {surah.numberOfAyahs} ayahs • {surah.revelationType}
            </div>
          </div>

          <div className="ayahs-container">
            {ayahs.map((ayah) => (
              <div
                key={ayah.number}
                className={`ayah-card ${selectedAyah?.number === ayah.number ? 'selected' : ''}`}
                onClick={() => handleAyahClick(ayah)}
              >
                <div className="ayah-header">
                  {selectedAyah?.number === ayah.number && (
                    <span className="selected-badge">Selected</span>
                  )}
                </div>
                <div className="ayah-text-arabic" dir="rtl">
                  {ayah.text}
                </div>
                <div className="ayah-number-symbol">
                  {ayah.numberInSurah} ۝
                </div>
              </div>
            ))}
          </div>

          {tafseer && (
            <div className="tafseer-panel">
              <h3 className="tafseer-title">Tafseer (Explanation)</h3>
              <div className="tafseer-content">{tafseer}</div>
            </div>
          )}

          {tafseerError && (
            <div className="error-message">{tafseerError}</div>
          )}
        </>
      ) : (
        <ReadingView
          surah={surah}
          ayahs={ayahs}
          selectedAyah={selectedAyah}
          onAyahSelect={onAyahSelect}
          onGetTafseer={async (ayah) => {
            setLoadingTafseer(true)
            setTafseerError(null)
            try {
              const result = await getTafseer(ayah, surah)
              setTafseer(result)
            } catch (error) {
              setTafseerError('Failed to fetch tafseer. Please try again.')
              console.error(error)
            } finally {
              setLoadingTafseer(false)
            }
          }}
          loadingTafseer={loadingTafseer}
          tafseer={tafseer}
          tafseerError={tafseerError}
          onViewModeChange={onViewModeChange}
        />
      )}

      {showPopup && selectedAyah && (
        <>
          {console.log('Rendering AyahPopup - showPopup:', showPopup, 'selectedAyah:', selectedAyah)}
          <AyahPopup
            ayah={selectedAyah}
            surah={surah}
            onClose={() => {
              console.log('Popup closed')
              setShowPopup(false)
            }}
            onStartTafseer={(ayah) => {
              console.log('onStartTafseer callback called with ayah:', ayah)
              handleStartTafseer(ayah)
            }}
          />
        </>
      )}

      {showChat && chatAyah ? (
        <>
          {console.log('About to render TafseerChat - showChat:', showChat, 'chatAyah:', chatAyah)}
          <TafseerChat
            ayah={chatAyah}
            surah={surah}
            onHide={() => {
              console.log('Chat hidden')
              setShowChat(false)
            }}
          />
        </>
      ) : (
        console.log('Not rendering TafseerChat - showChat:', showChat, 'chatAyah:', chatAyah)
      )}

      {/* Debug info */}
      {console.log('Render check - showChat:', showChat, 'chatAyah:', chatAyah, 'selectedAyah:', selectedAyah, 'showPopup:', showPopup)}

      {/* Floating button to reopen chat */}
      {!showChat && chatAyah && (
        <button 
          className="chat-reopen-btn"
          onClick={() => {
            console.log('Reopening chat, chatAyah:', chatAyah)
            setShowChat(true)
          }}
          title="Reopen Tafseer Chat"
        >
          💬
        </button>
      )}
    </div>
  )
}

// Reading View Component (Mushaf format - like quran.com)
function ReadingView({ surah, ayahs, selectedAyah, onAyahSelect, onGetTafseer, loadingTafseer, tafseer, tafseerError, onViewModeChange }) {
  const [currentMushafPage, setCurrentMushafPage] = useState(null)
  const [pageData, setPageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchingForPage, setSearchingForPage] = useState(false)
  const [fontSize, setFontSize] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [chatAyah, setChatAyah] = useState(null)
  const textContainerRef = useRef(null)
  const TOTAL_MUSHAF_PAGES = 604

  const handleStartTafseer = (ayah) => {
    setShowPopup(false)
    setChatAyah(ayah || selectedAyah)
    setShowChat(true)
  }

  const loadPage = async (pageNumber) => {
    if (pageNumber < 1 || pageNumber > TOTAL_MUSHAF_PAGES) return
    
    setLoading(true)
    const data = await getPage(pageNumber)
    if (data && data.ayahs) {
      // Filter ayahs to only show those from the selected surah
      const filteredAyahs = data.ayahs.filter(ayah => ayah.surah?.number === surah.number)
      setPageData({
        ...data,
        ayahs: filteredAyahs.length > 0 ? filteredAyahs : data.ayahs // If no ayahs from selected surah, show all (for context)
      })
    }
    setLoading(false)
  }

  // Find the Mushaf page that contains the first ayah of the selected surah using binary search
  useEffect(() => {
    const findPageForSurah = async () => {
      if (!ayahs || ayahs.length === 0) return
      
      const firstAyah = ayahs[0]
      if (!firstAyah) return
      
      setSearchingForPage(true)
      const targetAyahNumber = firstAyah.number
      
      // Binary search to find the page containing this ayah
      let left = 1
      let right = TOTAL_MUSHAF_PAGES
      let foundPage = null
      
      while (left <= right) {
        const mid = Math.floor((left + right) / 2)
        const pageData = await getPage(mid)
        
        if (!pageData || !pageData.ayahs || pageData.ayahs.length === 0) {
          break
        }
        
        const firstAyahOnPage = pageData.ayahs[0].number
        const lastAyahOnPage = pageData.ayahs[pageData.ayahs.length - 1].number
        
        // Check if target ayah is on this page
        if (targetAyahNumber >= firstAyahOnPage && targetAyahNumber <= lastAyahOnPage) {
          foundPage = mid
          break
        }
        
        // If target is before this page, search left
        if (targetAyahNumber < firstAyahOnPage) {
          right = mid - 1
        } else {
          // If target is after this page, search right
          left = mid + 1
        }
      }
      
      setSearchingForPage(false)
      if (foundPage) {
        setCurrentMushafPage(foundPage)
      } else {
        // Fallback: start from page 1
        setCurrentMushafPage(1)
      }
    }
    
    findPageForSurah()
  }, [surah.number, ayahs])

  useEffect(() => {
    if (currentMushafPage !== null && !searchingForPage) {
      loadPage(currentMushafPage)
    }
  }, [currentMushafPage, searchingForPage])

  // Dynamic font scaling to fit content perfectly
  useEffect(() => {
    if (!pageData || !textContainerRef.current) return

    const adjustFontSize = () => {
      const container = textContainerRef.current
      if (!container) return

      // Temporarily remove overflow hidden to measure actual content height
      const originalOverflow = container.style.overflow
      container.style.overflow = 'visible'
      
      // Get available height
      const containerRect = container.getBoundingClientRect()
      const paddingTop = parseFloat(window.getComputedStyle(container).paddingTop)
      const paddingBottom = parseFloat(window.getComputedStyle(container).paddingBottom)
      const availableHeight = containerRect.height - paddingTop - paddingBottom
      
      // Start with base font size - much larger minimums
      const baseFontSize = window.innerWidth <= 768 ? 1.4 : 2.0
      let minFontSize = window.innerWidth <= 768 ? 1.2 : 1.6
      let maxFontSize = window.innerWidth <= 768 ? 2.5 : 3.5
      let bestFontSize = baseFontSize
      
      // Also adjust line-height for better spacing
      const baseLineHeight = window.innerWidth <= 768 ? 2.0 : 2.5
      container.style.lineHeight = `${baseLineHeight}`
      
      // Binary search for optimal font size - less aggressive
      for (let i = 0; i < 8; i++) {
        container.style.fontSize = `${bestFontSize}rem`
        
        // Force reflow
        container.offsetHeight
        
        // Measure content height
        const contentHeight = container.scrollHeight - paddingTop - paddingBottom
        
        // Allow some tolerance - don't force exact fit
        if (Math.abs(contentHeight - availableHeight) < 10 || i === 7) {
          break
        }
        
        if (contentHeight > availableHeight) {
          maxFontSize = bestFontSize
          bestFontSize = (minFontSize + bestFontSize) / 2
        } else {
          minFontSize = bestFontSize
          bestFontSize = (bestFontSize + maxFontSize) / 2
        }
      }
      
      // Clamp to reasonable bounds - ensure we don't go below minimum
      bestFontSize = Math.max(minFontSize, Math.min(maxFontSize, bestFontSize))
      setFontSize(bestFontSize)
      
      // Set line-height proportionally
      const finalLineHeight = bestFontSize * (window.innerWidth <= 768 ? 1.5 : 1.3)
      container.style.lineHeight = `${finalLineHeight}`
      
      // Restore overflow
      container.style.overflow = originalOverflow || 'hidden'
    }

    // Adjust after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(adjustFontSize, 150)
    window.addEventListener('resize', adjustFontSize)
    
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', adjustFontSize)
    }
  }, [pageData])

  const findNextPageWithSurah = async (startPage, direction) => {
    const step = direction === 'next' ? 1 : -1
    let page = startPage + step
    
    while (page >= 1 && page <= TOTAL_MUSHAF_PAGES) {
      const data = await getPage(page)
      if (data && data.ayahs) {
        const hasSurahAyahs = data.ayahs.some(ayah => ayah.surah?.number === surah.number)
        if (hasSurahAyahs) {
          return page
        }
      }
      page += step
    }
    return null
  }

  const handlePreviousPage = async () => {
    if (currentMushafPage <= 1) return
    
    const prevPage = await findNextPageWithSurah(currentMushafPage, 'prev')
    if (prevPage) {
      setCurrentMushafPage(prevPage)
      onAyahSelect(null)
      setShowPopup(false)
      setShowChat(false)
    } else if (currentMushafPage > 1) {
      setCurrentMushafPage(currentMushafPage - 1)
      onAyahSelect(null)
      setShowPopup(false)
      setShowChat(false)
    }
  }

  const handleNextPage = async () => {
    if (currentMushafPage >= TOTAL_MUSHAF_PAGES) return
    
    const nextPage = await findNextPageWithSurah(currentMushafPage, 'next')
    if (nextPage) {
      setCurrentMushafPage(nextPage)
      onAyahSelect(null)
      setShowPopup(false)
      setShowChat(false)
    } else if (currentMushafPage < TOTAL_MUSHAF_PAGES) {
      setCurrentMushafPage(currentMushafPage + 1)
      onAyahSelect(null)
      setShowPopup(false)
      setShowChat(false)
    }
  }

  useEffect(() => {
    // Reset popup/chat when ayah changes
    if (!selectedAyah) {
      setShowPopup(false)
      setShowChat(false)
    }
  }, [selectedAyah?.number])

  // Swipe handlers for mobile
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = async () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentMushafPage < TOTAL_MUSHAF_PAGES) {
      await handleNextPage()
    }
    if (isRightSwipe && currentMushafPage > 1) {
      await handlePreviousPage()
    }
  }

  // Always show the selected surah info
  const getSurahInfo = () => {
    return {
      name: surah.name,
      englishName: surah.englishName
    }
  }

  if (loading || !pageData) {
    return <div className="loading">Loading page...</div>
  }

  const surahInfo = getSurahInfo()

  return (
    <div className="reading-view">
      <div className="reading-header-top">
        <button 
          className="reading-view-toggle-btn"
          onClick={() => onViewModeChange('list')}
        >
          Switch to List View
        </button>
      </div>
      
      <div 
        className="reading-content"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="reading-header">
          {surahInfo.name && (
            <>
              <h2 className="reading-surah-name-arabic">{surahInfo.name}</h2>
              {surahInfo.englishName && (
                <p className="reading-surah-name-english">{surahInfo.englishName}</p>
              )}
            </>
          )}
        </div>

        <div 
          ref={textContainerRef}
          className="reading-text-container"
          style={fontSize ? { 
            fontSize: `${fontSize}rem`
          } : {}}
        >
          {pageData.ayahs.length === 0 ? (
            <div className="no-ayahs-message">
              No ayahs from this surah on this page. Navigate to the next page.
            </div>
          ) : (
            pageData.ayahs.map((ayah) => (
              <span
                key={ayah.number}
                className={`reading-ayah ${selectedAyah?.number === ayah.number ? 'selected' : ''}`}
                onClick={() => {
                  onAyahSelect(ayah)
                  setShowPopup(true)
                }}
                dir="rtl"
              >
                <span className="ayah-text-content">{ayah.text}</span>
                <span 
                  className="ayah-marker"
                  style={fontSize ? { 
                    width: `${fontSize * 1.2}rem`,
                    height: `${fontSize * 1.2}rem`,
                    lineHeight: `${fontSize * 1.2}rem`,
                    fontSize: `${fontSize * 0.6}rem`
                  } : {}}
                >
                  {ayah.numberInSurah}
                </span>
              </span>
            ))
          )}
        </div>

        <div className="reading-footer">
          <div className="page-info">
            {currentMushafPage}
          </div>
        </div>
      </div>

      <div className="reading-controls desktop-only">
        <button 
          className="page-btn" 
          onClick={handlePreviousPage}
          disabled={currentMushafPage === 1}
        >
          ← Previous
        </button>
        <button 
          className="page-btn" 
          onClick={handleNextPage}
          disabled={currentMushafPage === TOTAL_MUSHAF_PAGES}
        >
          Next →
        </button>
      </div>

      {tafseer && (
        <div className="reading-tafseer-panel">
          <h3 className="tafseer-title">Tafseer (Explanation)</h3>
          <div className="tafseer-content">{tafseer}</div>
        </div>
      )}

      {tafseerError && (
        <div className="error-message">{tafseerError}</div>
      )}

      {showPopup && selectedAyah && (
        <AyahPopup
          ayah={selectedAyah}
          surah={surah}
          onClose={() => setShowPopup(false)}
          onStartTafseer={(ayah) => handleStartTafseer(ayah)}
        />
      )}

      {showChat && chatAyah && (
        <TafseerChat
          ayah={chatAyah}
          surah={surah}
          onHide={() => setShowChat(false)}
        />
      )}

      {/* Floating button to reopen chat */}
      {!showChat && chatAyah && (
        <button 
          className="chat-reopen-btn"
          onClick={() => setShowChat(true)}
          title="Reopen Tafseer Chat"
        >
          💬
        </button>
      )}
    </div>
  )
}

export default AyahViewer
