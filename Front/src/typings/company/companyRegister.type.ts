export interface IRegisterCompany {
  name: string; // ime kompanije 
  email: string; // email kompanije
  phone: string; // broj telefona kompanije
  HQaddress: string; // HQ adresa
  workingHours: { // radno vrijeme HQ-a
    mon: {form: number, to: number},
    tue: {form: number, to: number},
    wen: {form: number, to: number},
    thu: {form: number, to: number},
    fri: {form: number, to: number},
    sat: {form: number, to: number},
    sun: {form: number, to: number}
  }
  password: string; // lozinka kompanije 
  password_confirm: string; // potvrda lozinke
};
