import { Stack } from '@mui/material';
import ProfileRightColumn from './ProfileRightColumn';
import ProfileFeed from './ProfileFeed';
import ProfileIntro from './ProfileIntro';

export default function ProfileInner() {
  return (
    <Stack
      sx={{
        borderRadius: 2,
        boxShadow: { xs: 0, md: 1 },
        p: { xs: 0, md: 2 },
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        gap: 3,
        minHeight: '500px',
      }}
    >
      <Stack sx={{ flex: '0 0 20%' }}>
        <ProfileIntro />
      </Stack>
      <ProfileFeed />
      <ProfileRightColumn />
    </Stack>
  );
}