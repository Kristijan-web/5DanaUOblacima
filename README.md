# 5DanaUOblacima

A canteen reservation management system with availability preview and meal booking capabilities.

## Techonogies and versions

| Technology            | Verzion |
| --------------------- | ------- |
| Node.js               | 22      |
| TypeScript            | 5.9.3   |
| Express               | 5.1.0   |
| Mongoose              | 9.0.0   |
| MongoDB               | 7.0+    |
| JSONWebToken          | 9.0.2   |
| Dotenv                | 17.2.3  |
| Nodemon               | 3.1.11  |
| MongoDB Memory Server | 10.3.0  |

Setup Build Environment

1. Download and install from nodejs.org or use a version manager like nvm.

2. Clone repistory: git clone https://github.com/Kristijan-web/5DanaUOblacima.git

3. Install dependencies: npm install

Run Applicaton

- Run command: npm run build

## File structure

```
├── app.ts                 # Main application file
├── server.ts              # Server setup
├── controllers/           # Route controllers
├── models/                # Mongoose models
├── routes/                # Express routers
├── utils/                 # Helper functions
├── dist/                  # Compiled JavaScript (generated)
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

## API Endpoints RESTFul

- **Canteens**: `/canteens` - Management of canteens and viewing available slots
- **Reservations**: `/reservations` - Reservation management
- **Students**: `/students` - Student management
