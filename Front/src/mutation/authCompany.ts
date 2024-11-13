import { fetcher } from '@/fetchers/fetcher';
import { IRegisterCompany } from '@/typings/company/companyRegister.type';

interface IregisterSucess {
  success: string;
}

export async function registerCompany(
  url: string,
  { arg }: { arg: IRegisterCompany }
) {
  const data = await fetcher<IregisterSucess>(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  });
  /*  localStorage.setItem('user-id', (data as IUser).user.id); */
  return data;
}
