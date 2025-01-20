import { fetcher } from '@/fetchers/fetcher';
import { IEditPassword, IEditUser, IRegisterUser } from '@/typings/users/user.type';

interface ISuccess {
  success: string;
}

export async function updateProfile<T>(
  url: string,
  { arg }: { arg: T }
) {
  const data = await fetcher<ISuccess>(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  });

  console.log('podaci sa servera za register korisnika: ', data);
  return data;
}