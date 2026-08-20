import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

console.log('✅ index.js загружен!');
console.log('React:', React);
console.log('ReactDOM:', ReactDOM);

const root = ReactDOM.createRoot(document.getElementById('root'));
console.log('✅ root создан:', root);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('✅ root.render() вызван!');