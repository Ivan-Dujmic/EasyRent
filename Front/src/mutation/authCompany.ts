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

  console.log('podaci sa servera za register autokuce: ', data);
  return data;
}
