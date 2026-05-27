import { useEffect, useRef, useState } from 'react'

import { getModePresentation } from '../../config/modeConfig'
import { useAppMode } from '../../context/AppModeContext'
import '../../styles/floating-menu.css'
import ModeIcon from './ModeIcon'

export default function FloatingMenu() {
  const { mode, setMode, modeList } = useAppMode()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  const activePresentation = getModePresentation(mode)
  const activeEntry = modeList.find((entry) => entry.id === mode)

  useEffect(() => {
    if (!open) return undefined

    function handlePointerDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  function handleSelect(nextMode) {
    setMode(nextMode)
    setOpen(false)
  }

  return (
    <>
      {open && (
        <div
          className="geo-floating-menu__backdrop"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        ref={rootRef}
        className={`geo-floating-menu${open ? ' geo-floating-menu--open' : ''}`}
        style={{
          '--mode-accent': activePresentation.color,
          '--mode-accent-rgb': activePresentation.accentRgb,
        }}
      >
      <div
        id="geo-floating-menu-panel"
        className="geo-floating-menu__panel"
        role="menu"
        aria-label="Modos operacionais"
        aria-hidden={!open}
      >
        <div className="geo-floating-menu__header">Modo operacional</div>

        {modeList.map((entry) => {
          const isActive = entry.id === mode

          return (
            <button
              key={entry.id}
              type="button"
              role="menuitemradio"
              aria-checked={isActive}
              className={`geo-floating-menu__option${
                isActive ? ' geo-floating-menu__option--active' : ''
              }`}
              style={{
                '--mode-accent': entry.color,
                '--mode-accent-rgb': entry.accentRgb,
              }}
              onClick={() => handleSelect(entry.id)}
            >
              <span className="geo-floating-menu__icon">
                <ModeIcon name={entry.icon} />
              </span>
              <span className="geo-floating-menu__copy">
                <span className="geo-floating-menu__label">
                  {entry.label}
                </span>
                <span className="geo-floating-menu__desc">
                  {entry.description}
                </span>
              </span>
              <span className="geo-floating-menu__dot" aria-hidden="true" />
            </button>
          )
        })}
      </div>

      <button
        type="button"
        className="geo-floating-menu__trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls="geo-floating-menu-panel"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="geo-floating-menu__trigger-icon">
          <ModeIcon name={activePresentation.icon} />
        </span>
        <span className="geo-floating-menu__trigger-text">
          <span className="geo-floating-menu__trigger-kicker">Operação</span>
          <span className="geo-floating-menu__trigger-label">
            {activeEntry?.label}
          </span>
        </span>
        <svg
          className="geo-floating-menu__chevron"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M7 10l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      </div>
    </>
  )
}
