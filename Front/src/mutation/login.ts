import { fetcher } from '@/fetchers/fetcher';
import { ILogIn } from '@/typings/logIn/logIn.type';

export interface ILoginData {
  success: number;
  role: 'company' | 'user';
  balance: string;
  firstName: string;
}

export async function logIn(url: string, { arg }: { arg: ILogIn }) {
  const data = await fetcher<ILoginData>(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  });

  if (data?.success) {
    // Pretpostavljam da data sadrži korisničke podatke
    localStorage.setItem('userData', JSON.stringify(data));
  }

  console.log('podaci sa servera za login: ', data);
  return data;
}
