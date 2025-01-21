import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './store/store';
import { Provider } from 'react-redux';

async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  try {
    const { worker } = await import('./mocks/browser')
    if (worker) {
      await worker.start({
        onUnhandledRequest: 'bypass', // Prevents errors for unhandled requests
      })
      console.log('Mock Service Worker started')
    }
  } catch (error) {
    console.error('Error starting MSW:', error)
  }
}

enableMocking().then(() => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
