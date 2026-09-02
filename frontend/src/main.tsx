import { StrictMode, Fragment } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const STRICT_MODE = false
const Wrapper = STRICT_MODE ? StrictMode : Fragment

createRoot(document.getElementById('root')!).render(
  <Wrapper>
    <App />
  </Wrapper>,
)
