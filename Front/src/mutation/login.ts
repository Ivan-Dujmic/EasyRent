import { fetcher } from '@/fetchers/fetcher';
import { ILogIn } from '@/typings/logIn/logIn.type';

interface IregisterSucess {
  success: string;
}

export async function logIn(url: string, { arg }: { arg: ILogIn }) {
  const data = await fetcher<IregisterSucess>(url, {
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
