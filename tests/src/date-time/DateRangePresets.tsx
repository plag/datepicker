import React, { Component } from 'react';

import { subDays, startOfMonth, format } from 'date-fns';
import classnames from 'classnames';
import Button from '../button/Button';

import { Range, OnChange } from './types';

import './DateRangePresets.sass';

const TODAY = new Date();
const FORMAT = 'yyyy-MM-dd';

const PRESETS = [
  {
    value: {
      [Range.FROM]: format(TODAY, FORMAT),
      [Range.TO]: format(TODAY, FORMAT),
    },
    label: 'Today',
  },
  {
    value: {
      [Range.FROM]: format(subDays(TODAY, 1), FORMAT),
      [Range.TO]: format(subDays(TODAY, 1), FORMAT),
    },
    label: 'Yesterday',
  },
  {
    value: {
      [Range.FROM]: format(subDays(TODAY, 7), FORMAT),
      [Range.TO]: format(TODAY, FORMAT),
    },
    label: 'Last 7 days',
  },
  {
    value: {
      [Range.FROM]: format(subDays(TODAY, 30), FORMAT),
      [Range.TO]: format(TODAY, FORMAT),
    },
    label: 'Last 30 days',
  },
  {
    value: {
      [Range.FROM]: format(startOfMonth(TODAY), FORMAT),
      [Range.TO]: format(TODAY, FORMAT),
    },
    label: 'Last month',
  },
  {
    value: null,
    label: 'All time',
  },
];

const isCurrentPreset = (from: Date, to: Date, preset: any): boolean => {
  if (preset.value === null) {
    if (from === null && to === null) {
      return true;
    }

    return false;
  }

  const compareFromValue = from === null ? null : format(from, FORMAT);
  const compareToValue = to === null ? null : format(to, FORMAT);

  return compareFromValue === preset.value[Range.FROM] && compareToValue === preset.value[Range.TO];
};

export const getPresetLabel = (from: Date, to: Date, userFormat: string): string => {
  const foundPreset = PRESETS.find(function(preset): any {
    return isCurrentPreset(from, to, preset);
  });

  if (foundPreset !== undefined) {
    return foundPreset.label;
  }

  let result = '';

  if (from) {
    result += format(from, userFormat);
  }

  result += ' — ';

  if (to) {
    result += format(to, userFormat);
  }

  return result;
};

interface DateRangePresetsProps {
  onSelect: OnChange;
  selectedFrom?: Date;
  selectedTo?: Date;
}

export default class DateRangePresets extends Component<DateRangePresetsProps> {
  public render(): React.ReactNode {
    return (
      <div className="date-range__presets">
        {
          PRESETS.map((preset, index): React.ReactElement => (
            <Button
              key={ index }
              className={ classnames('button__text date-range__preset', {
                'date-range__preset--active': isCurrentPreset(this.props.selectedFrom, this.props.selectedTo, preset),
              } ) }
              onClick={ (): void => { this.props.onSelect(preset.value); } }
            >
              { preset.label }
            </Button>
          ))
        }
      </div>
    );
  }
}
