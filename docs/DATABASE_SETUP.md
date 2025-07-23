# Database Setup Guide

## Prerequisites

1. **Supabase Account**: Make sure you have a Supabase account and project set up
2. **Environment Variables**: Ensure your `.env.local` file has the correct Supabase credentials

## Manual Database Setup

If you prefer to set up the database manually through Supabase Dashboard:

### 1. Create Users Table

Run this SQL in your Supabase SQL editor:

```sql
-- Copy the content from migrations/create_users_table.sql
```

### 2. Create Species Clicks Table

```sql
-- Copy the content from migrations/create_species_clicks_table.sql
```

### 3. Create Helper Functions

```sql
-- Copy the content from migrations/create_increment_counter_function.sql
```

## Automated Setup

### Using Supabase CLI (Recommended)

1. Install Supabase CLI:

```bash
npm install -g supabase
```

2. Login to Supabase:

```bash
supabase login
```

3. Link your project:

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

4. Run migrations:

```bash
supabase db push
```

### Using Scripts

For Windows:

```cmd
./scripts/run-migrations.bat
```

For Unix/Linux/Mac:

```bash
./scripts/run-migrations.sh
```

## Verify Setup

After running the migrations, verify that the following tables exist in your Supabase dashboard:

- `users` - For user authentication and profiles
- `genus` - For plant genus data
- `species` - For plant species data
- `species_clicks` - For tracking user interactions

## Authentication Setup

### Email/Password Authentication

1. Go to Authentication > Settings in your Supabase dashboard
2. Enable Email authentication
3. Configure email templates as needed

### OAuth Authentication (Google)

1. Go to Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Client ID
   - Client Secret
4. Set authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback` (development)
   - `https://yourdomain.com/api/auth/callback` (production)

## Row Level Security (RLS)

The migrations automatically set up RLS policies for the users table:

- Users can only view and update their own profile
- Authenticated users can insert their profile data
- Service role can perform all operations

## Troubleshooting

### Common Issues

1. **Environment Variables**: Make sure your `.env.local` file has the correct Supabase URL and anon
   key
2. **Authentication Policies**: If having auth issues, check RLS policies in Supabase dashboard
3. **Migration Errors**: Run migrations one by one if the batch script fails

### Getting Help

- Check Supabase documentation: https://supabase.com/docs
- Review the project's GitHub issues
- Check browser console for detailed error messages
