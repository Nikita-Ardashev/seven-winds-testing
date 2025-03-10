import './index.style.sass';

import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import { EntityTree } from './store/treeRows.ts';

EntityTree.setTree();

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
