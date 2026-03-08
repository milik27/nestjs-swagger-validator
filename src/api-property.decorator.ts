import { applyDecorators } from '@nestjs/common';
import {
  ApiProperty as SwaggerApiProperty,
  type ApiPropertyOptions as ApiPropertyOptionsSwagger,
} from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsDefined,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { IsNullable, IsUndefined } from './validators';

type BaseOptions = Omit<ApiPropertyOptionsSwagger, 'type'> & {
  isNotEmpty?: boolean;
  typeClass?: any;
  validateNested?: boolean;
  arrayMinSize?: number;
};

type StringOptions = BaseOptions & {
  type: 'string';
  isEmail?: boolean;
  isPhone?: boolean;
  isUrl?: boolean;
  isDate?: boolean;
};

type NumberOptions = BaseOptions & {
  type: 'number';
  isPositive?: boolean;
  isInt?: boolean;
};

type BooleanOptions = BaseOptions & {
  type: 'boolean';
};

type ObjectOptions = BaseOptions & {
  type: 'object';
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
type ClassType = Function | [Function];

type ClassOptions = BaseOptions & {
  type: ClassType;
};

type EnumOptions = BaseOptions & {
  type?: undefined;
  enum: Record<string, unknown> | readonly string[] | string[];
};

type NoTypeOptions = BaseOptions & {
  type?: undefined;
  enum?: undefined;
};

type ApiPropertyOptions =
  | StringOptions
  | NumberOptions
  | BooleanOptions
  | ObjectOptions
  | EnumOptions
  | ClassOptions
  | NoTypeOptions;

function getOptionalDecorator(options: ApiPropertyOptions): PropertyDecorator[] {
  if (options.nullable && options.required === false) {
    return [IsOptional({ each: options.isArray })];
  }

  if (options.nullable) {
    return [IsNullable({ each: options.isArray })];
  }

  if (options.required === false) {
    return [IsOptional({ each: options.isArray }), IsUndefined({ each: options.isArray })];
  }

  return [IsDefined({ each: options.isArray })];
}

function ApiProperty(options: ApiPropertyOptions): PropertyDecorator {
  const decorators: PropertyDecorator[] = [
    SwaggerApiProperty(options as ApiPropertyOptionsSwagger),
    Expose(),
    ...getOptionalDecorator(options),
  ];

  if (options.type === 'string' && !options.format) {
    decorators.push(IsString({ each: options.isArray }));

    if (options.isEmail) {
      decorators.push(IsEmail(undefined, { each: options.isArray }));
    }

    if (options.isUrl) {
      decorators.push(IsUrl(undefined, { each: options.isArray }));
    }

    if (options.isPhone) {
      decorators.push(IsPhoneNumber(undefined, { each: options.isArray }));
    }

    if (options.isDate) {
      decorators.push(IsDateString(undefined, { each: options.isArray }));
    }
  }

  if (options.type === 'number') {
    decorators.push(Type(() => Number));
    decorators.push(IsNumber({}, { each: options.isArray }));

    if (options.isPositive) {
      decorators.push(IsPositive({ each: options.isArray }));
    }

    if (options.isInt) {
      decorators.push(IsInt({ each: options.isArray }));
    }
  }

  if (options.type === 'boolean') {
    decorators.push(IsBoolean({ each: options.isArray }));
  }

  if (options.type === 'object') {
    decorators.push(IsObject({ each: options.isArray }));
  }

  if (options.enum) {
    decorators.push(IsEnum(options.enum, { each: options.isArray }));
  }

  if (options.minLength !== undefined) {
    decorators.push(MinLength(options.minLength, { each: options.isArray }));
  }

  if (options.maxLength !== undefined) {
    decorators.push(MaxLength(options.maxLength, { each: options.isArray }));
  }

  if (options.isNotEmpty) {
    decorators.push(IsNotEmpty({ each: options.isArray }));
  }

  if (options.typeClass) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    decorators.push(Type(() => options.typeClass));
  }

  if (options.validateNested) {
    decorators.push(ValidateNested({ each: options.isArray }));
  }

  if (options.isArray) {
    decorators.push(IsArray());
  }

  if (options.arrayMinSize) {
    decorators.push(ArrayMinSize(options.arrayMinSize));
  }

  return applyDecorators(...decorators) as PropertyDecorator;
}

export { ApiProperty };
export type {
  ApiPropertyOptions,
  BooleanOptions,
  ClassOptions,
  EnumOptions,
  NoTypeOptions,
  NumberOptions,
  ObjectOptions,
  StringOptions,
};
