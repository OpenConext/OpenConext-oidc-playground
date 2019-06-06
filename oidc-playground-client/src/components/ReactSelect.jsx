import React from "react";
import Select from "react-select";
import Creatable from "react-select/lib/Creatable";
import form from "../stylesheets/form.scss";

const styles = {
  input: (base, _) => {
    return { ...base, margin: 0, paddingBottom: 0, paddingTop: 0 };
  },
  valueContainer: (base, _) => {
    return { ...base, padding: form.inputPadding };
  },
  singleValue: (base, _) => {
    return { ...base, color: form.color };
  },
  multiValue: (base, state) => {
    return {
      ...base,
      backgroundColor: state.data.isFixed ? form.grey : form.blue
    };
  },
  multiValueLabel: (base, state) => {
    return {
      ...base,
      color: "white",
      fontSize: form.fontSize,
      padding: "3px 6px",
      paddingRight: state.data.isFixed ? 6 : 2
    };
  },
  multiValueRemove: (base, state) => {
    return {
      ...base,
      color: "white",
      padding: 2,
      borderRadius: 0,
      borderTopRightRadius: 2,
      borderBottomRightRadius: 2,
      ":hover": {
        backgroundColor: form.red
      },
      display: state.data.isFixed ? "none" : "flex"
    };
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
    values = value.filter(val => !options.includes(val));
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

  const value = formatValue(props.value, props.options, freeFormat, fixedValues);
  const options = formatOptions(props.options);
  const onChange = option => props.onChange(formatReturnValue(option));
  return freeFormat ? (
    <Creatable {...{ ...rest, value, options, onChange, styles }} />
  ) : (
    <Select {...{ ...rest, value, options, onChange, styles }} />
  );
}
