import React from "react";
import Select from "react-select";
import Creatable from "react-select/lib/Creatable";
import form from "../stylesheets/form.scss";

const styles = {
  multiValueRemove: (base, state) => {
    return state.data.isFixed ? { ...base, display: "none" } : base;
  },
  input: (base, _) => {
    return { ...base, margin: 0, paddingBottom: 0, paddingTop: 0 };
  },
  valueContainer: (base, _) => {
    return { ...base, padding: form.inputPadding };
  },
  singleValue: (base, _) => {
    return { ...base, color: form.color };
  },
  control: (base, _) => {
    const {
      borderColor,
      borderRadius,
      borderWidth,
      fontFamily,
      fontSize,
      fontStyle,
      fontWeight,
      transition,
      hoverBorderColor
    } = form;

    return {
      ...base,
      borderColor,
      borderRadius,
      borderWidth,
      fontFamily,
      fontSize,
      fontStyle,
      fontWeight,
      transition,
      "&:hover": { borderColor: hoverBorderColor }
    };
  }
};

function formatOptions(options) {
  return options.map(opt => ({ value: opt, label: opt }));
}

function formatArrayValue(value, options, freeFormat, fixedValues) {
  let values = value;

  if (!freeFormat) {
    values = value.filter(val => !options.includes(value));
  }

  return values.map(val => ({
    value: val,
    label: val,
    isFixed: fixedValues.includes(val)
  }));
}

function formatValue(value, options, freeFormat, fixedValues) {
  if (Array.isArray(value)) {
    return formatArrayValue(value, options, freeFormat, fixedValues);
  }

  if (!freeFormat && !options.includes(value)) {
    return null;
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
  const { freeFormat, fixedValues = [], ...rest } = props;

  const value = formatValue(
    props.value,
    props.options,
    freeFormat,
    fixedValues
  );
  const options = formatOptions(props.options);
  const onChange = option => props.onChange(formatReturnValue(option));

  if (freeFormat) {
    return <Creatable {...{ ...rest, value, options, onChange, styles }} />;
  }

  return <Select {...{ ...rest, value, options, onChange, styles }} />;
}
