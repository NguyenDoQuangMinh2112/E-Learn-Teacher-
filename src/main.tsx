import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'react-markdown-editor-lite/lib/index.css'
import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter } from 'react-router-dom'
import GlobalStyles from './components/GlobalStyles'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './redux/store.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GlobalStyles>
          <App />
        </GlobalStyles>
      </PersistGate>
    </Provider>
  </BrowserRouter>
)
