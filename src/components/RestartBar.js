import React from 'react'

export default function RestartBar({resetFinder = () => {}}) {

  return (
    <div className="bh-finder__restartBar">
      <button className="bh-finder__next btn btn-primary-dark" onClick={resetFinder}>BH-Finder neu starten</button>
    </div>
  )
}