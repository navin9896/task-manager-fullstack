# Task Manager Frontend

Angular 21 standalone frontend for Task Manager.

## Commands

```bash
npm install
npm start
```

App runs on `http://localhost:4200`.

## Build

```bash
npm run build
```

## API Integration

- API base URL is configured as `/api` in:
  - `src/environments/environment.ts`
  - `src/environments/environment.prod.ts`
- Local development proxy is configured in `proxy.conf.json`:
  - `/api` -> `http://localhost:5000`
