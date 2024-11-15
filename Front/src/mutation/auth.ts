import { fetcher } from '@/fetchers/fetcher';
import { IRegisterUser } from '@/typings/users/user.type';

interface IregisterSucess {
  success: string;
}

export async function registerUser(
  url: string,
  { arg }: { arg: IRegisterUser }
) {
  const data = await fetcher<IregisterSucess>(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  });

  console.log('podaci sa servera za register korisnika: ', data);
  return data;
}
