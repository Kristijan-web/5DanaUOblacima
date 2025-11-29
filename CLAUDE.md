# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A canteen reservation management system built with Node.js, TypeScript, Express, and Mongoose. The system manages student reservations for canteen meals with availability preview and booking capabilities.

## Build & Development Commands

- **Build and run**: `npm run build` - Compiles TypeScript to `dist/` and starts server with nodemon
- **TypeScript compilation**: `tsc` - Manually compile TypeScript (output goes to `dist/`)

The project uses MongoDB Atlas for the database. Connection string must be provided in `config.env` file.

## Architecture

### Application Structure

The application follows a classic MVC pattern with Express:

- **Entry point**: `server.ts` - Connects to MongoDB Atlas and starts Express server
- **App configuration**: `app.ts` - Defines Express middleware and route mounting
- **Controllers**: Handle request logic and call models
- **Models**: Mongoose schemas with validation and middleware
- **Routes**: Express routers that map endpoints to controllers
- **Utils**: Shared utilities for error handling and responses

### Data Models

**Student** (`models/studentModel.ts`)
- Fields: name, email, isAdmin
- Email must be unique
- Used for authentication via `studentId` header

**Canteen** (`models/CanteenModel.ts`)
- Fields: name, location, capacity, workingHours
- workingHours is an array of meal periods (meal, from, to)
- Name must be unique

**Reservation** (`models/reservationModel.ts`)
- Fields: studentId (ref), canteenId (ref), date, time, duration
- **Important pre-save middleware**:
  1. Validates reservation is not in the past
  2. Validates time is on the hour (:00) or half-hour (:30)
  3. Prevents duplicate reservations (same student, canteen, date, time)
- Pre-find middleware auto-populates studentId and canteenId references

### Error Handling Pattern

The codebase uses a centralized error handling approach:

1. **AppError** (`utills/appError.ts`): Custom error class with statusCode and operational flag
2. **catchAsync** (`utills/catchAsync.ts`): Wrapper for async route handlers that catches errors and forwards to error middleware
3. **globalErrorMiddleware** (`controllers/errorController.ts`): Centralized error handler mounted last in `app.ts`

All controller functions should be wrapped with `catchAsync()`.

### Authentication

Authentication uses a simplified header-based approach:
- Client sends `studentId` in request headers
- `protect` middleware (`controllers/authController.ts:54`) validates studentId and attaches student to request
- `allowedTo()` middleware checks if user has admin role
- JWT code is commented out but available for reference

### Response Pattern

Use `sendResponse()` utility (`utills/sendResponse.ts`) for consistent API responses across all controllers.

## Key Patterns

### Model Virtuals
All models use `toJSON.transform` to:
- Map `_id` to `id` field
- Remove `_id` and `__v` from responses

### Mongoose Middleware
Reservation model contains critical business logic in pre-save hooks:
- Time validation (must be :00 or :30)
- Date validation (no past reservations)
- Duplicate prevention

When modifying reservation logic, check these middleware functions first.

### TypeScript Types
Models export their types via `InferSchemaType<typeof schema>`:
- `StudentType`
- `canteenType`
- `ReservationType`

Use these types when working with model instances.

## API Structure

Three main routers mounted in `app.ts`:
- `/students` - Student management and signup
- `/canteens` - Canteen CRUD and availability
- `/reservations` - Reservation CRUD

All routes follow RESTful conventions.

## Development Notes

- TypeScript config extends `@tsconfig/node22`
- Compiled output goes to `dist/`
- The server connects to MongoDB Atlas (persistent database)
- **Required environment variables in `config.env`**:
  - `DATABASE` - MongoDB Atlas connection string (required)
  - `PORT` - Server port (optional, defaults to 3000)
- Config file path is `./config.env` (loaded in `server.ts`)
- Make sure to add `config.env` to `.gitignore`
