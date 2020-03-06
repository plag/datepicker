import React, { useState } from 'react';
import './App.sass';

import DateRangePicker from 'plag-datepicker/lib/date-time/DateRangePicker';

import 'plag-datepicker/src/date-time/styles/DateRangePicker.sass';
import 'plag-datepicker/src/date-time/styles/DateRangePresets.sass';
import 'plag-datepicker/src/date-time/styles/DateTime.sass';

const App: React.FC = () => {
  const [date, setDate] = useState(null);

  // const from = format(subDays(new Date(), 7), 'yyyy-MM-dd');
  // const to = format(new Date(), 'yyyy-MM-dd');

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
            />
          </div>
        </section>

      </main>
    </div>
  );
}

export default App;
