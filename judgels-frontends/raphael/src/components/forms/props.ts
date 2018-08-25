import { FormInputMeta } from './meta';

export interface FormInputProps {
  input: {
    name: string;
    value: any;
    onBlur: any;
    onChange: any;
  };
  inputHelper?: string;
  meta: FormInputMeta;
  label: string;
  labelHelper?: string;
  autoFocus?: boolean;
}
