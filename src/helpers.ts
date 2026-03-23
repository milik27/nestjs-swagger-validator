import { IsDefined, IsOptional } from 'class-validator';

import type { ApiPropertyOptions, MessageOption, NumberMessageOption } from './types';
import { IsNullable, IsUndefined } from './validators';

export function getMessage(option: MessageOption | undefined): string | undefined {
  return typeof option === 'object' ? option.message : undefined;
}

export function getNumberOption(option: NumberMessageOption): { value: number; message?: string } {
  return typeof option === 'object' ? option : { value: option };
}

export function getOptionalDecorator(options: ApiPropertyOptions): PropertyDecorator[] {
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
