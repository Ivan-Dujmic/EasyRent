export interface FooterLink {
  label: string; // Tekst prikazan na linku
  href: string; // URL na koji link vodi
  icon?: React.ElementType; // Opcionalna ikonica za link
}

export interface FooterLinks {
  quickLinks: FooterLink[];
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  socialLinks: FooterLink[];
  paymentIcons?: React.ElementType[]; // Opcionalno za ikone plaćanja
}
