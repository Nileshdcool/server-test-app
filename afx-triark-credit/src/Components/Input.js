import { DatePicker, Form, Input, Select, AutoComplete } from "antd";
import React, { useState } from "react";
import "./index.scss";

function InputText({ name, label, type = "input", ...rest }) {
  const [id, setId] = useState(+new Date());
  const [addClass, setAddClass] = useState(false);
  const labelProps = {id : "datePickerLabel"};
  const componentProps = { id, ...rest };
  let InputField = Input;
  const value =
    document.getElementById(id)?.value || rest.value || rest.defaultValue;
  if (type === "date") {
    if (addClass || value) {
      labelProps.id = "datePickerLabel";
    }
    componentProps.onOpenChange = (e) => setAddClass(e);
    InputField = DatePicker;
  }
  if (type === "dropdown") {
    if (addClass || value) {
      labelProps.id = "datePickerLabel";
    }
    componentProps.style = { minWidth: "180px" };
    InputField = Select;
  }
  if (type === "input") {
    if (addClass || value) {
      labelProps.id = "datePickerLabel";
    }
  }
  if (type === "number") {
    if (addClass || value) {
      labelProps.id = "datePickerLabel";
    }
  }
   if (type === "search") {
    if (addClass || value) {
      labelProps.id = "datePickerLabel";
    }
  }
  return (
    <React.Fragment>
      {type == "search" ? (
        <div className={`inputWrapper "transparentWrapper`}>
          <Form.Item noStyle>
            <AutoComplete placeholder={""} {...componentProps} />
          </Form.Item>
          <label {...labelProps}>{label}</label>
        </div>
      ) : (
        <div className={`inputWrapper "transparentWrapper`}>
          <Form.Item noStyle>
            <InputField placeholder={""} {...componentProps} />
          </Form.Item>
          <label {...labelProps}>{label}</label>
        </div>
      )}
    </React.Fragment>
  );
}

export default InputText;
