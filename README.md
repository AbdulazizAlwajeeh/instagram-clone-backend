# InstaClone Backend

A NestJS-based migration and replacement for the original Supabase backend.

## Project Setup

### 1. Generate the Database Schema
Run the following command to pull your existing schema down from Supabase:

```bash
npx typeorm-model-generator -h [YOUR_SUPABASE_HOST] -d postgres -u postgres.[YOUR_PROJECT_ID] -x [YOUR_SUPABASE_DB_PASSWORD] -p 6543 -e postgres -o [THE_PATH_TO_STORE_THE_SCHEMA]
```

> 💡 **Note on Connection Values:** The bracketed values `[...]` above are placeholders. You can find your specific credentials in your **Supabase Dashboard** under **Connect** -> **Direct Connection String** -> **Transaction Pooler**.

### 2. Configure the Database Connection
Once the schema is pulled, update your connection configurations in `AppModule` (you can refer to the repository's initial commit for structural reference). Provide your target database credentials here to push and apply your schema.
