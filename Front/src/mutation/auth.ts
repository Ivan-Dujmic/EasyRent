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
  /*  localStorage.setItem('user-id', (data as IUser).user.id); */
  return data;
}
