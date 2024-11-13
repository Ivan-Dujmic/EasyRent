import { fetcher } from '@/fetchers/fetcher';
import { ILogIn } from '@/typings/logIn/logIn.type';

interface IregisterSucess {
  success: string;
}

export async function logIn(
  url: string,
  { arg }: { arg: ILogIn }
) {
  const data = await fetcher<IregisterSucess>(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  });
  /*  localStorage.setItem('user-id', (data as IUser).user.id); */
  return data;
}
