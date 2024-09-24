// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project import
import AuthWrapper from './AuthWrapper';
import AuthCreateStore from './auth-forms/AuthCreateStore';

// ================================|| LOGIN ||================================ //

export default function CreateStorePage() {
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h3">Create Store</Typography>
        </Grid>
        <Grid item xs={12}>
          <AuthCreateStore />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
