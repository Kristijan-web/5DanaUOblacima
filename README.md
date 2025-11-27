# 5DanaUOblacima

Sistem za upravljanje rezervacijama u kantinama sa mogućnostima pregleda dostupnosti i zakazivanja obroka.

## Korišćene tehnologije i verzije

| Tehnologija           | Verzija             |
| --------------------- | ------------------- |
| Node.js               | 22                  |
| TypeScript            | 5.9.3               |
| Express               | 5.1.0               |
| Mongoose              | 9.0.0               |
| MongoDB               | 7.0+                |
| JSONWebToken          | 9.0.2               |
| Dotenv                | 17.2.3              |
| Nodemon               | (dev dependency)    |
| MongoDB Memory Server | 10.3.0 (za testove) |

Setup Build Environment

1. Download and install from nodejs.org or use a version manager like nvm.

2. Clone repistory: git clone https://github.com/Kristijan-web/5DanaUOblacima.git

3. Install dependencies: npm install

Run Applicaton

- Run command npm run build

## Podešavanje okruženja

### Preduslovi

- **Node.js** verzija 22 ili novija
- **npm** ili **yarn** package manager
- **MongoDB** - lokalna instalacija ili MongoDB Atlas konekcija

### Instalacija zavisnosti

1. Klonirajte repozitorijum:

```bash
git clone https://github.com/Kristijan-web/5DanaUOblacima.git
cd 5DanaUOblacima
```

 Instrukcije za pokretanje aplikacije

// da ima instaliran node
/ na kom portu itd..

```bash
npm install
```

3. Kreirajte `.env` fajl u root direktorijumu sa sledećim varijablama:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/hackathon-levi9
NODE_ENV=development
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

## Pokretanje build-a

Aplikacija je napisana u TypeScript-u i mora biti kompajlirana u JavaScript pre nego što se pokrene.

### Development build (sa watch modom)

```bash
npm run build
```

Ova komanda će:

1. Kompajlirati TypeScript fajlove u `dist` direktorijum
2. Pokrenuti Nodemon koji će automatski restartovati server pri svakoj promeni koda

### Production build

```bash
npx tsc
```

Ovo će samo kompajlirati TypeScript u JavaScript bez pokretanja aplikacije.

## Pokretanje aplikacije

### U development modu

```bash
npm run build
```

Server će biti dostupan na `http://localhost:3000`

### U production modu

```bash
npx tsc
node dist/server.js
```

## Pokretanje unit testova

Konfiguracija za testove je dostupna, ali test skripte nisu još u potpunosti implementirane.

Za pokretanje testova (kada budu dostupni):

```bash
npm test
```

### Postavljanje testova

Projekat koristi **MongoDB Memory Server** za testove kako bi se izbegla potreba za lokalnom MongoDB bazom tokom testiranja.

Zavisnosti za testiranje su već instalirane:

- `mongodb-memory-server@10.3.0` - In-memory MongoDB instanca
- `@types/node` - TypeScript tipovi za Node.js

Kada budu implementirani testovi, oni će se pokrenuti sa:

```bash
npm test
```

## Struktura projekta

```
├── app.ts                 # Glavna aplikacija
├── server.ts              # Server setup
├── controllers/           # Kontroleri za rutama
├── models/                # Mongoose modeli
├── routes/                # Express rutere
├── utills/                # Pomoćne funkcije
├── dist/                  # Kompajlirani JavaScript (generisan)
├── package.json           # Zavisnosti i skripte
├── tsconfig.json          # TypeScript konfiguracija
└── README.md              # Ovaj fajl
```

## API Endpoints

- **Canteens**: `/canteens` - Upravljanje kantinama i pregled dostupnih slotova
- **Reservations**: `/reservations` - Upravljanje rezervacijama
- **Students**: `/students` - Upravljanje studentima

ISC
