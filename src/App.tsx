import React, { useState } from 'react';
import './App.sass';

import format from 'date-fns/format';
import subDays from 'date-fns/subDays';
import parse from 'date-fns/parse';
import DateRangePicker from 'plag-datepicker/lib/date-time/DateRangePicker';
import Button from 'plag-datepicker/lib/button/Button';

import 'plag-datepicker/src/date-time/styles/DateRangePicker.sass';
import 'plag-datepicker/src/date-time/styles/DateRangePresets.sass';
import 'plag-datepicker/src/date-time/styles/DateTime.sass';

const App: React.FC = () => {
  const [date, setDate] = useState(null);

  const setupDate = () => {
    setDate({
      from: format(subDays(new Date(), 29), 'yyyy-MM-dd'),
      to: format(new Date(), 'yyyy-MM-dd'),
    });
  };

  const blockDate = parse('2020-01-15', 'yyyy-MM-dd', new Date())

  const from = format(subDays(blockDate, 7), 'yyyy-MM-dd');
  const to = format(blockDate, 'yyyy-MM-dd');

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
              value={ {
                from: format(blockDate, 'yyyy-MM-dd'),
                to: format(blockDate, 'yyyy-MM-dd'),
              } }
              onChange={ (value) => setDate((value as any)) }
              from={ from }
              to={ to }
            />
          </div>
        </section>
        <Button onClick={ setupDate }>Click me</Button>

      </main>
    </div>
  );
}

export default App;
