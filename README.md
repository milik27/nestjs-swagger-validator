# nestjs-swagger-validator

One decorator to rule them all. Combines **Swagger documentation** and **class-validator validation** into a single `@ApiProperty()` call for your NestJS DTOs.

## The Problem

A typical NestJS DTO looks like this:

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, IsEmail, MaxLength } from 'class-validator';

class CreateUserDto {
  @ApiProperty({ type: 'string', example: 'user@example.com' })
  @IsDefined()
  @IsString()
  @IsEmail()
  @MaxLength(255)
  email: string;
}
```

**5 decorators** for a single field. It gets worse with optional/nullable fields.

## The Solution

```typescript
import { ApiProperty } from 'nestjs-swagger-validator';

class CreateUserDto {
  @ApiProperty({ type: 'string', example: 'user@example.com', isEmail: true, maxLength: 255 })
  email: string;
}
```

**1 decorator.** Same Swagger docs. Same validation. Fully type-safe.

## Installation

```bash
npm install nestjs-swagger-validator
```

### Peer dependencies

```bash
npm install @nestjs/common @nestjs/swagger class-transformer class-validator
```

## Usage

### String

```typescript
@ApiProperty({ type: 'string', example: 'hello' })
name: string;

@ApiProperty({ type: 'string', isEmail: true, example: 'user@example.com' })
email: string;

@ApiProperty({ type: 'string', isUrl: true })
website: string;

@ApiProperty({ type: 'string', isPhone: true })
phone: string;

@ApiProperty({ type: 'string', isDate: true, example: '2024-01-01' })
birthDate: string;

@ApiProperty({ type: 'string', minLength: 8, maxLength: 128 })
password: string;

@ApiProperty({ type: 'string', matches: /^[a-z0-9-]+$/ })
slug: string;
```

### Number

```typescript
@ApiProperty({ type: 'number', example: 25 })
age: number;

@ApiProperty({ type: 'number', isPositive: true })
price: number;

@ApiProperty({ type: 'number', isInt: true })
quantity: number;

@ApiProperty({ type: 'number', min: 0, max: 100 })
percent: number;
```

### Date

```typescript
@ApiProperty({ type: 'date', example: '2024-01-01T00:00:00Z' })
createdAt: Date;

@ApiProperty({ type: 'date', minDate: new Date('2020-01-01'), maxDate: new Date('2030-01-01') })
eventDate: Date;
```

### Boolean

```typescript
@ApiProperty({ type: 'boolean', example: true })
isActive: boolean;
```

### Enum

```typescript
enum Role { ADMIN = 'admin', USER = 'user' }

@ApiProperty({ enum: Role, example: Role.USER })
role: Role;
```

### Nested objects

```typescript
@ApiProperty({ type: AddressDto, typeClass: AddressDto, validateNested: true })
address: AddressDto;
```

### Arrays

```typescript
@ApiProperty({ type: 'string', isArray: true, arrayMinSize: 1 })
tags: string[];

@ApiProperty({ type: [ItemDto], isArray: true, typeClass: ItemDto, validateNested: true })
items: ItemDto[];
```

## Optionality & Nullability

The decorator handles four cases based on `required` and `nullable`:

| Configuration | Accepts | Decorator behavior |
|---|---|---|
| _(default)_ | `value` | `@IsDefined()` — must be present and non-null |
| `required: false` | `value \| undefined` | `@IsOptional()` — can be omitted, but cannot be `null` |
| `nullable: true` | `value \| null` | `@IsNullable()` — must be present, but can be `null` |
| `required: false, nullable: true` | `value \| null \| undefined` | `@IsOptional()` — can be omitted or `null` |

```typescript
@ApiProperty({ type: 'string', required: false })
bio?: string;

@ApiProperty({ type: 'string', nullable: true })
middleName: string | null;

@ApiProperty({ type: 'string', required: false, nullable: true })
nickname?: string | null;
```

## Custom Error Messages

Type validators (`IsString`, `IsNumber`, `IsBoolean`, `IsDate`, `IsObject`) use `typeMessage`:

```typescript
@ApiProperty({ type: 'string', typeMessage: 'Must be a string' })
name: string;

@ApiProperty({ type: 'number', typeMessage: 'Must be a number' })
age: number;

@ApiProperty({ type: 'boolean', typeMessage: 'Must be true or false' })
isActive: boolean;

@ApiProperty({ type: 'date', typeMessage: 'Must be a valid date' })
createdAt: Date;
```

All boolean validators (`isEmail`, `isUrl`, `isPhone`, `isDate`, `isPositive`, `isInt`, `isNotEmpty`) accept an object with a `message` property:

```typescript
@ApiProperty({
  type: 'string',
  isEmail: { message: 'Invalid email format' },
  isNotEmpty: { message: 'Email is required' },
})
email: string;

@ApiProperty({
  type: 'number',
  isPositive: { message: 'Must be positive' },
  isInt: { message: 'Must be an integer' },
})
age: number;
```

Numeric validators (`minLength`, `maxLength`, `arrayMinSize`, `min`, `max`) accept a `value`/`message` object:

```typescript
@ApiProperty({
  type: 'string',
  minLength: { value: 3, message: 'At least 3 characters' },
  maxLength: { value: 50, message: 'At most 50 characters' },
})
name: string;

@ApiProperty({
  type: 'number',
  min: { value: 0, message: 'Must be at least 0' },
  max: { value: 100, message: 'Must be at most 100' },
})
percent: number;
```

Date range validators (`minDate`, `maxDate`) accept a `value`/`message` object:

```typescript
@ApiProperty({
  type: 'date',
  minDate: { value: new Date('2020-01-01'), message: 'Must be after 2020' },
  maxDate: { value: new Date('2030-01-01'), message: 'Must be before 2030' },
})
eventDate: Date;
```

Regex matching with a custom message:

```typescript
@ApiProperty({
  type: 'string',
  matches: { pattern: /^[a-z0-9-]+$/, message: 'Must be a valid slug' },
})
slug: string;
```

Enum with a custom message:

```typescript
@ApiProperty({ enum: Role, enumMessage: 'Must be a valid role' })
role: Role;
```

## Custom Validators

The package also exports `IsNullable` and `IsUndefined` validators for standalone use:

```typescript
import { IsNullable, IsUndefined } from 'nestjs-swagger-validator';
```

## License

MIT