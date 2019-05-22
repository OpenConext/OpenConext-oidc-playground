import React from "react";
import Select from "react-select";
import Creatable from "react-select/lib/Creatable";

function formatOptions(options) {
  return options.map(opt => ({ value: opt, label: opt }));
}

function formatValue(value, options, freeFormat) {
  if (!freeFormat && !options.includes(value)) {
    return null;
  }

  if (Array.isArray(value)) {
    return value.map(val => ({ value: val, label: val }));
  }

  return { value, label: value };
}

function formatReturnValue(option) {
  if (Array.isArray(option)) {
    return option.map(opt => opt.value);
  }

  return option.value;
}

export function ReactSelect(props) {
  const { isMulti, freeFormat } = props;

  const value = formatValue(props.value, props.options, freeFormat);
  const options = formatOptions(props.options);
  const onChange = option => props.onChange(formatReturnValue(option));

  if (freeFormat) {
    return <Creatable {...{ value, options, onChange, isMulti }} />;
  }

  return <Select {...{ value, options, onChange, isMulti }} />;
}
