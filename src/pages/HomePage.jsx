import CinematicHero from '../components/home/CinematicHero'
import CinematicProblem from '../components/home/CinematicProblem'
import CinematicSolution from '../components/home/CinematicSolution'
import CinematicHowItWorks from '../components/home/CinematicHowItWorks'
import CinematicFeatures from '../components/home/CinematicFeatures'
import CinematicClosing from '../components/home/CinematicClosing'

const HomePage = () => {
  return (
    <div className="relative bg-primary-dark">
      {/* Cinematic Sections */}
      <CinematicHero />
      <CinematicProblem />
      <CinematicSolution />
      <CinematicHowItWorks />
      <CinematicFeatures />
      <CinematicClosing />
    </div>
  )
}

export default HomePage
