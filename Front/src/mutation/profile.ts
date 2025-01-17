import { fetcher } from '@/fetchers/fetcher';
import { IEditUser, IRegisterUser } from '@/typings/users/user.type';

interface IEditSuccess {
  success: string;
}

export async function updateProfile(
  url: string,
  { arg }: { arg: IEditUser }
) {
  const data = await fetcher<IEditSuccess>(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  });

  console.log('podaci sa servera za register korisnika: ', data);
  return data;
}
