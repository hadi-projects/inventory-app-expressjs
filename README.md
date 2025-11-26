### 1. Clone atau ekstrak project
```cd inventory-app```

### 2. Install dependencies
```npm install```

### 3. Setup database MySQL
#### - Buat database sesuai SQL di atas
#### - Update .env dengan kredensial MySQL Anda
```mysql -u root < config/migration.sql```

### 4. Jalankan development
```npm run dev```

### Atau production
```npm start```