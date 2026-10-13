# Karwan client (Person B)
```
cp .env.example .env
npm install
npm run dev
```
`VITE_USE_MOCKS=true` runs with no backend. Regenerate mocks from the seed values with `npm run mocks`.
Switch one feature to the real API by adding its name to `MOCK_OFF` in `src/lib/api.js`.
