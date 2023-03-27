// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './globalStyle.css'


const container = document.getElementById('root')
const root = createRoot(container!)

root.render(<React.StrictMode>
  <App />
</React.StrictMode>)

