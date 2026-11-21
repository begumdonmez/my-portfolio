import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SpacePage from './pages/SpacePage'

// Each planet is its own chunk, downloaded only when you travel there.
const ArcadePage = lazy(() => import('./arcade/ArcadePage'))
const CinemaPage = lazy(() => import('./cinema/CinemaPage'))
const MuseumPage = lazy(() => import('./museum/MuseumPage'))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SpacePage />} />
        <Route
          path="/arcade"
          element={
            <Suspense fallback={<div className="route-fallback" />}>
              <ArcadePage />
            </Suspense>
          }
        />
        <Route
          path="/sinema"
          element={
            <Suspense fallback={<div className="route-fallback" />}>
              <CinemaPage />
            </Suspense>
          }
        />
        <Route
          path="/muze"
          element={
            <Suspense fallback={<div className="route-fallback" />}>
              <MuseumPage />
            </Suspense>
          }
        />
        <Route path="*" element={<SpacePage />} />
      </Routes>
    </BrowserRouter>
  )
}
