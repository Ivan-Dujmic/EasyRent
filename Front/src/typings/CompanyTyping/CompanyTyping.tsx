//kasnije ce trebat zamjenit sa nkeim interfacom
export type IRegisterCompany = {
  name: string;
  email: string;
  phone: string;
  HQaddress: string;
  workingHours: {
    mon: {form: number, to: number},
    tue: {form: number, to: number},
    wen: {form: number, to: number},
    thu: {form: number, to: number},
    fri: {form: number, to: number},
    sat: {form: number, to: number},
    sun: {form: number, to: number}
  }
  password: string;
  password_confirm: string;
};
