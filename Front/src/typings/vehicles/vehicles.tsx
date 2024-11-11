export interface Vehicle {
  image: string; // URL slike vozila
  brand: string; // Marka vozila
  company: string; // Kompanija koja nudi vozilo
  pricePerDay: number; // Cijena po danu (u lokalnoj valuti)
  rating: number; // Ocjena vozila (npr. od 1 do 5)
  reviews: number; // Broj pregleda vozila
  transmission: 'manual' | 'automatic'; // Vrsta mjenjača (manualni ili automatski)
  seats: number; // Broj sjedala u vozilu
  id: number;
}
