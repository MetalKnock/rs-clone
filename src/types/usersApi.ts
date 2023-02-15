import { IUser } from './data';
import { IFormValues, TLoginValues } from './formValues';

type AddUserArg = Pick<IUser, 'name' | 'email' | 'password' | 'country' | 'birthDate' | 'createdAt' | 'alias'>;

type UpdateUserArg = Partial<
  Pick<
    IUser,
    'name' | 'email' | 'password' | 'country' | 'birthDate' | 'alias' | 'avatarURL' | 'postsIds' | 'friendsIds'
  >
>;

type HideUserArg = Pick<IUser, 'password'>;

interface IAddUserProps {
  arg: AddUserArg;
}

interface IUpdateUserProps {
  arg: UpdateUserArg;
}

interface IHideUserProps {
  arg: HideUserArg;
}

interface ILoginUser {
  arg: TLoginValues;
}

interface IRegistrationUser {
  arg: Omit<IFormValues, 'passwordConfirm'>;
}

export type {
  AddUserArg,
  UpdateUserArg,
  HideUserArg,
  IAddUserProps,
  IUpdateUserProps,
  IHideUserProps,
  ILoginUser,
  IRegistrationUser,
};
