import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

// Entry point: hydrate the React app into the DOM element with id "root"
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
