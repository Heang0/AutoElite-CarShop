# AutoElite Backend (Express + MongoDB)

This backend powers the Ionic app with dynamic car inventory data.

## 1) Setup

```bash
cd backend
npm install
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

## 2) Start MongoDB

Make sure MongoDB is running locally on:

`mongodb://127.0.0.1:27017/autoelite`

If you use another connection string, update `MONGO_URI` in `.env`.

## 3) Seed Sample Data

```bash
npm run seed
```

## 4) Run API

```bash
npm run dev
```

The API starts on:

`http://127.0.0.1:4000`

## 5) Endpoints

- `GET /api/health`
- `GET /api/cars`
- `GET /api/cars/:id`

### Optional query filters for `GET /api/cars`

- `search`
- `brand`
- `type`
- `min_price`
- `max_price`

Example:

`GET /api/cars?search=tesla&min_price=30000&max_price=150000`
