import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/index.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <AppRoutes />
    </BrowserRouter>
  )
}
