import { Box, ListItem, Stack, Typography } from '@mui/material';
import { currentLocales } from '../../../mock-data/data';
import { IMessage, IUser } from '../../../types/data';
import ClickableAvatar from '../../ClickableAvatar';

interface IMessageProps {
  user: IUser;
  message: IMessage;
  isLeft: boolean;
}

export default function Message({ user, message, isLeft }: IMessageProps) {
  return (
    <ListItem sx={{ flexDirection: 'column', mr: isLeft ? 'auto' : 0, maxWidth: '80%', ml: !isLeft ? 'auto' : 0 }}>
      <Stack sx={{ flexDirection: 'row', alignItems: 'end', gap: 2, width: '100%' }}>
        {isLeft && <ClickableAvatar user={user} />}
        <Typography
          sx={{
            flexGrow: 1,
            bgcolor: isLeft ? 'primary.main' : 'secondary.main',
            p: 2,
            borderRadius: isLeft ? '8px 8px 8px 0 ' : '8px 8px 0 8px',
            wordWrap: 'break-word',
            wordBreak: 'break-all',
          }}
        >
          {message.description}
        </Typography>
        {!isLeft && <ClickableAvatar user={user} />}
      </Stack>
      <Stack sx={{ flexDirection: 'row', width: '100%' }}>
        <Box sx={{ ml: isLeft ? 'auto' : 0, mr: !isLeft ? 'auto' : 0 }}>
          {new Date(message.createdAt).toLocaleString(currentLocales, {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Box>
      </Stack>
    </ListItem>
  );
}
