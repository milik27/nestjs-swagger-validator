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
```

### Number

```typescript
@ApiProperty({ type: 'number', example: 25 })
age: number;

@ApiProperty({ type: 'number', isPositive: true })
price: number;

@ApiProperty({ type: 'number', isInt: true })
quantity: number;
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

## Custom Validators

The package also exports `IsNullable` and `IsUndefined` validators for standalone use:

```typescript
import { IsNullable, IsUndefined } from 'nestjs-swagger-validator';
```

## License

MIT