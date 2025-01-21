export interface IUser {
  role: "guest" | "user" | "company" | "admin"
  firstName?: string;
  lastName?: string;
  companyName?: string;
  balance?: number;
  user_id: number
}

export interface IReview {
  rating: number;
  firstName: string;
  lastName: string;
  reviewDate: string;
  description: string;
}

export interface IRegisterUser {
  firstName: string; // Ime korisnika
  lastName: string; // Prezime korisnika
  driversLicense: string; // Broj vozačke dozvole
  email: string; // Email korisnika
  phoneNo: string; // Broj telefona korisnika
  password: string; // Lozinka korisnika
  confirmPassword: string; // Potvrda lozinke
}

export interface IEditUser {
  firstName: string; // Ime korisnika
  lastName: string; // Prezime korisnika
  driversLicense: string; // Broj vozačke dozvole
  phoneNo: string; // Broj telefona korisnika
}

export interface IEditPassword {
  password: string; // Lozinka korisnika
  confirmPassword: string; // Potvrda lozinke
  oldPassword: string; // Stara lozinka
}

export interface IGetUser {
  firstName: string; // Ime korisnika
  lastName: string; // Prezime korisnika
  driversLicense: string; // Broj vozačke dozvole
  phoneNo: string; // Broj telefona korisnika
  password: string; // Lozinka korisnika
}

export interface IDelete {
  password: string
}

