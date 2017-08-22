import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './components/App';
import { Bathroom } from "./models/Bathroom"

const bathroom = Bathroom.create()

ReactDOM.render(<App bathroom={bathroom} />, document.getElementById('root'));
