import * as yup from 'yup';
import moment from 'moment';
import { Box, Button, Grid, InputLabel, TextField, TextFieldProps } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useSWRMutation from 'swr/mutation';
import { useTranslation } from 'react-i18next';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useState } from 'react';
import i18next from 'i18next';
import { ApiPath, API_BASE_URL, locales } from '../../../../constants';
import EditProfileInput from './EditProfileInput';
import { IUser } from '../../../../types/data';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { updateUser } from '../../../../api/usersApi';
import { setUser } from '../../../../store/reducers/usersState';

export default function EditProfileForm() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.users.idAuthorizedUser);
  const authUser = useAppSelector((state) => state.users.authorizedUser);
  const [birthdate, setBirthdate] = useState<string | null>('');

  i18next.on('languageChanged', (lng: string): void => {
    moment.locale(lng);
  });

  const schema = yup.object().shape({
    email: yup.string().email(),
    password: yup
      .string()
      .nullable()
      .transform((value: string, origin: string) => (origin === '' ? null : value))
      .matches(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,15}/),
    name: yup
      .string()
      .nullable()
      .transform((value: string, origin: string) => (origin === '' ? null : value))
      .min(5),
    country: yup
      .string()
      .nullable()
      .transform((value: string, origin: string) => (origin === '' ? null : value))
      .min(3),
    birthDate: yup
      .string()
      .nullable()
      .transform((value: string, origin: string) => (origin === '' ? null : value))
      .test('birthDate', (date: string | undefined | null): boolean =>
        date === null ? true : moment().diff(moment(date, locales[moment.locale()]), 'years') >= 14
      ),
    alias: yup
      .string()
      .nullable()
      .transform((value: string, origin: string) => (origin === '' ? null : value))
      .min(5),
  });

  const defaultValues = {
    email: authUser?.email,
    name: authUser?.name,
    password: '',
    country: authUser?.country,
    birthDate: '',
    alias: authUser?.alias || '',
  };

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
  } = useForm<Partial<IUser>>({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const { trigger } = useSWRMutation(`${API_BASE_URL}${ApiPath.users}/${userId}`, updateUser);

  const update = async (data: Partial<IUser>): Promise<void> => {
    const filteredData: Partial<IUser> = Object.fromEntries(Object.entries(data).filter((el) => el[1]));

    if (filteredData.birthDate) {
      filteredData.birthDate = new Date(filteredData.birthDate).toISOString();
    }

    const user = await trigger(filteredData);
    if (user) {
      dispatch(setUser(user));
    }
  };

  const resetForm = () => reset(defaultValues);

  return (
    <Box component="form" sx={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit(update)}>
      <Grid container rowSpacing={2} columnSpacing={3} sx={{ mb: '30px' }}>
        <Grid item xs={12} md={6}>
          <EditProfileInput
            helperText={errors.name ? t('registration.errors.name.validation') : ''}
            name="name"
            control={control}
          >
            {t('settings.editProfile.form.name')}
          </EditProfileInput>
        </Grid>
        <Grid item xs={12} md={6}>
          <EditProfileInput
            helperText={errors.alias ? t('registration.errors.alias.validation') : ''}
            name="alias"
            control={control}
          >
            {t('settings.editProfile.form.alias')}
          </EditProfileInput>
        </Grid>
        <Grid item xs={12} md={6}>
          <EditProfileInput
            helperText={errors.country ? t('registration.errors.country.validation') : ''}
            name="country"
            control={control}
          >
            {t('settings.editProfile.form.country')}
          </EditProfileInput>
        </Grid>
        <Grid item xs={12} md={6}>
          <EditProfileInput
            helperText={errors.email ? t('registration.errors.email.validation') : ''}
            name="email"
            control={control}
          >
            {t('settings.editProfile.form.email')}
          </EditProfileInput>
        </Grid>
        <Grid item xs={12} md={6}>
          <EditProfileInput
            helperText={errors.password ? t('registration.errors.password.validation') : ''}
            name="password"
            control={control}
          >
            {t('settings.editProfile.form.password')}
          </EditProfileInput>
        </Grid>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DesktopDatePicker
              OpenPickerButtonProps={{
                size: 'small',
              }}
              value={birthdate}
              onChange={(val: string | null): void => setBirthdate(val)}
              renderInput={(props: TextFieldProps): JSX.Element => {
                return (
                  <Box>
                    <InputLabel sx={{ mb: '5px', fontWeight: '700', fontSize: '0.9rem' }}>
                      {t('settings.editProfile.form.birthDate')}
                    </InputLabel>
                    <TextField
                      type="date"
                      {...props}
                      {...register('birthDate')}
                      size="small"
                      variant="outlined"
                      error={!!errors.birthDate}
                      fullWidth
                      autoComplete="off"
                      helperText={errors.birthDate ? t('registration.errors.birthDate.validation') : ''}
                    />
                  </Box>
                );
              }}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
      <Box sx={{ alignSelf: 'flex-end' }}>
        <Button sx={{ mr: '10px', color: 'text.secondary' }} type="button" onClick={resetForm}>
          {t('settings.buttons.cancel')}
        </Button>
        <Button variant="contained" sx={{ borderRadius: '8px' }} type="submit">
          {t('settings.buttons.save')}
        </Button>
      </Box>
    </Box>
  );
}
