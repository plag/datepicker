import React, { useState } from 'react';
import './App.sass';


import DateRangePicker from './date-time/DateRangePicker';

const App: React.FC = () => {
  const [date, setDate] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <main>
        <section>
          <h1>Datepicker</h1>
          <div>
            <DateRangePicker
              value={ date }
              onChange={ (value) => setDate((value as any)) }
              to="2020-01-15"
            />
          </div>
        </section>

      </main>
    </div>
  );
}

export default App;
