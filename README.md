## Project setup

1. Run command:

```bash
npm install
```

2. Copy the content of `.env.template` file and paste it in a new file named `.env`

3. Run docker with the command:

```bash
docker compose up -d
```

## Compile and run the project

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Generate Migrations

To generate migrations use the command

```bash
npx typeorm-ts-node-commonjs migration:generate migrations/<migration-name> -d src/data-source.ts -p
```

## Run Migrations

To run pending migrations use the command 

```bash
npx typeorm-ts-node-commonjs migration:run -d src/data-source.ts
```