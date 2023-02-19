import { useEffect } from 'react';
import useSWRMutation from 'swr/mutation';
import { useLocation } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { darkTheme } from './themes/darkTheme';
import { lightTheme } from './themes/lightTheme';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import Header from './components/Header/Header';
import { ApiPath, API_BASE_URL, KEY_LOCAL_STORAGE, LSKeys } from './constants';
import { refreshToken } from './api/usersApi';
import { ILogin } from './types/data';
import { getToken, setToken } from './utils/common';
import { setAuth, setAuthError, setLoading } from './store/reducers/authSlice';
import { setUser, usersLoadingSuccess } from './store/reducers/usersState';
import usePosts from './hooks/usePosts';
import useUsers from './hooks/useUsers';
import { postsLoadingSuccess } from './store/reducers/postsState';
import useComments from './hooks/useComments';
import { commentsLoadingSuccess } from './store/reducers/commentsState';
import Footer from './components/Footer/Footer';
import useMessagesWs from './hooks/useMessagesWs';
import Routes from './components/Routes';

function App() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const theme = useAppSelector((state) => state.theme.mode);

  const { users, isLoadingUsers, isValidatingUsers } = useUsers();
  const { posts, isLoadingPosts, isValidatingPosts } = usePosts();
  const { comments, isLoadingComments, isValidatingComments } = useComments();

  const { trigger } = useSWRMutation(`${API_BASE_URL}${ApiPath.refresh}`, refreshToken);

  const checkAuth = async (): Promise<void> => {
    dispatch(setAuth(false));
    dispatch(setLoading(true));
    try {
      const res: Response | undefined = await trigger();
      if (res?.ok) {
        const resData = (await res?.json()) as ILogin;
        const { accessToken, user } = resData;
        dispatch(setAuth(true));
        setToken(accessToken);
        dispatch(setUser(user));
      } else {
        throw new Error('Authorization error. Re-login required');
      }
    } catch {
      dispatch(setAuthError(true));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    const accessToken = getToken();

    if (accessToken) {
      checkAuth().catch((err: Error): Error => err);
    }

    localStorage.setItem(`${LSKeys.path}_${KEY_LOCAL_STORAGE}`, location.pathname);
  }, []);

  useMessagesWs();

  useEffect(() => {
    if (
      users &&
      posts &&
      comments &&
      !isLoadingUsers &&
      !isLoadingPosts &&
      !isLoadingComments &&
      !isValidatingUsers &&
      !isValidatingPosts &&
      !isValidatingComments
    ) {
      dispatch(usersLoadingSuccess(users));
      dispatch(postsLoadingSuccess(posts));
      dispatch(commentsLoadingSuccess(comments));
    }
  }, [
    users,
    posts,
    comments,
    isLoadingUsers,
    isLoadingPosts,
    isLoadingComments,
    isValidatingUsers,
    isValidatingPosts,
    isValidatingComments,
    dispatch,
  ]);

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <CssBaseline />
      <Header />
      <Box component="main" sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <Routes />
      </Box>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
