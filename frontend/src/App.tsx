import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import TrustBar from './components/TrustBar'
import Features from './components/Features'
import Packages from './components/Packages'
import Flow from './components/Flow'
import Faq from './components/Faq'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Paket from './pages/Paket'
import JamaahList from './pages/JamaahList'
import JamaahProfil from './pages/JamaahProfil'
import JamaahForm from './pages/JamaahForm'
import TripList from './pages/TripList'
import TripForm from './pages/TripForm'
import Registration from './pages/Registration'
import Invoice from './pages/Invoice'
import Rombongan from './pages/Rombongan'
import Serambi from './pages/Serambi'

function Landing() {
  return (
    <div className="bg-white font-sans leading-relaxed text-[#111]">
      <Header />
      <Hero />
      <TrustBar />
      <Features />
      <Packages />
      <Flow />
      <Faq />
      <Contact />
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/paket" element={<Paket />} />
        <Route path="/jamaah" element={<JamaahList />} />
        <Route path="/jamaah/profil/:uuid" element={<JamaahProfil />} />
        <Route path="/jamaah/blanko/:mode/:uuid" element={<JamaahForm />} />
        <Route path="/trip" element={<TripList />} />
        <Route path="/trip/blanko/:mode/:uuid" element={<TripForm />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/registration/invoice/:uuid" element={<Invoice />} />
        <Route path="/rombongan" element={<Rombongan />} />
        <Route path="/serambi" element={<Serambi />} />
      </Routes>
    </Router>
  )
}
