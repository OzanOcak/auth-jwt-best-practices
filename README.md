## Authorization Code Flow 

### Features

- Access and Refresh Token
- Client Id
- Revocation of Refresh Token
- Rotation of Refresh Token
- Access Token is stored in Memory (/w Zustand). 
- Refresh Token is stored in cookie
- Refresh Access Token logic handled with Axios Interceptor
- User Creditentials and Tokens tables save in database

- Role based Authorization (branch)
- OTP (branch)


### Project set up and run

`touch .env`

```text
DB_HOST=localhost
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=database
DB_PORT=5432
PORT=3000
NODE_ENV=development
ACCESS_JWT_SECRET=43064b71b542b7a92294dc63d4b8e7058d1378de6f0768021f658cbd55309564e20a3d735c741d022d406a1435eaf77d51d0158089e9d69ac3cce6d02f1be055
REFRESH_JWT_SECRET=d4b21a805190a1e0887581aadf9f57723ad0a9fbfe04514338e3d0ced4d38786d53f026858d1eb994ed4104a911766a7ed8a4f395fcdbefab8d32cafa2056543
DATABASE_URL=postgres://postgres:postgres@localhost:5432/database

# >node
# >require("crypto").randomBytes(64).toString('hex')
```

```bash
cd backend
npm install
npm run migrate
npm run dev

docker compose up -d

npx drizzle-kit studio // or http://localhost:8080 for admin

cd frontend
npm install
npm run dev
```
