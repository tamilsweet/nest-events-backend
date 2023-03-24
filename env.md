# Environment Files

## For Development
`.env.dev`
```
DB_CONNECTION="mysql"
DB_HOST=
DB_PORT=
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
DB_DROP_SCHEMA=false

APP_URL=
SUPPORTEMAIL="support@${APP_URL}"

JWT_SECRET=
```

## For Testing
`.env.test`
```
DB_CONNECTION="mysql"
DB_HOST=
DB_PORT=
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
DB_DROP_SCHEMA=true

APP_URL=
SUPPORTEMAIL="support@${APP_URL}"

JWT_SECRET=
```
