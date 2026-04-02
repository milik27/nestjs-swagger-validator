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
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsPhoneNumber,
  IsPositive,
  IsString,
  IsUrl,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { getMessage, getNumberOption, getOptionalDecorator } from './helpers';
import type { ApiPropertyOptions, EnumOptions } from './types';

function ApiProperty(options: ApiPropertyOptions): PropertyDecorator {
  const decorators: PropertyDecorator[] = [
    SwaggerApiProperty(options as ApiPropertyOptionsSwagger),
    Expose(),
    ...getOptionalDecorator(options),
  ];

  if (options.type === 'string' && !options.format) {
    decorators.push(IsString({ each: options.isArray, message: options.typeMessage }));

    if (options.isEmail) {
      decorators.push(IsEmail(undefined, { each: options.isArray, message: getMessage(options.isEmail) }));
    }

    if (options.isUrl) {
      decorators.push(IsUrl(undefined, { each: options.isArray, message: getMessage(options.isUrl) }));
    }

    if (options.isPhone) {
      decorators.push(IsPhoneNumber(undefined, { each: options.isArray, message: getMessage(options.isPhone) }));
    }

    if (options.isDate) {
      decorators.push(IsDateString(undefined, { each: options.isArray, message: getMessage(options.isDate) }));
    }

    if (options.matches) {
      if (options.matches instanceof RegExp) {
        decorators.push(Matches(options.matches, { each: options.isArray }));
      } else {
        decorators.push(Matches(options.matches.pattern, { each: options.isArray, message: options.matches.message }));
      }
    }
  }

  if (options.type === 'number') {
    decorators.push(Type(() => Number));
    decorators.push(IsNumber({}, { each: options.isArray, message: options.typeMessage }));

    if (options.isPositive) {
      decorators.push(IsPositive({ each: options.isArray, message: getMessage(options.isPositive) }));
    }

    if (options.isInt) {
      decorators.push(IsInt({ each: options.isArray, message: getMessage(options.isInt) }));
    }

    if (options.min !== undefined) {
      const { value, message } = getNumberOption(options.min);
      decorators.push(Min(value, { each: options.isArray, message }));
    }

    if (options.max !== undefined) {
      const { value, message } = getNumberOption(options.max);
      decorators.push(Max(value, { each: options.isArray, message }));
    }
  }

  if (options.type === 'boolean') {
    decorators.push(IsBoolean({ each: options.isArray, message: options.typeMessage }));
  }

  if (options.type === 'object') {
    decorators.push(IsObject({ each: options.isArray, message: options.typeMessage }));
  }

  if ('enum' in options && options.enum) {
    const enumMessage = (options as EnumOptions).enumMessage;
    decorators.push(IsEnum(options.enum, { each: options.isArray, message: enumMessage }));
  }

  if (options.minLength !== undefined) {
    const { value, message } = getNumberOption(options.minLength);
    decorators.push(MinLength(value, { each: options.isArray, message }));
  }

  if (options.maxLength !== undefined) {
    const { value, message } = getNumberOption(options.maxLength);
    decorators.push(MaxLength(value, { each: options.isArray, message }));
  }

  if (options.isNotEmpty) {
    decorators.push(IsNotEmpty({ each: options.isArray, message: getMessage(options.isNotEmpty) }));
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

  if (options.arrayMinSize !== undefined) {
    const { value, message } = getNumberOption(options.arrayMinSize);
    decorators.push(ArrayMinSize(value, { message }));
  }

  return applyDecorators(...decorators) as PropertyDecorator;
}

export { ApiProperty };
