import type { ApiPropertyOptions as ApiPropertyOptionsSwagger } from '@nestjs/swagger';

export type MessageOption = boolean | { message?: string };
export type NumberMessageOption = number | { value: number; message?: string };

type BaseOptions = Omit<ApiPropertyOptionsSwagger, 'type' | 'minLength' | 'maxLength'> & {
  isNotEmpty?: MessageOption;
  typeClass?: any;
  validateNested?: boolean;
  arrayMinSize?: NumberMessageOption;
  minLength?: NumberMessageOption;
  maxLength?: NumberMessageOption;
};

export type StringOptions = BaseOptions & {
  type: 'string';
  isEmail?: MessageOption;
  isPhone?: MessageOption;
  isUrl?: MessageOption;
  isDate?: MessageOption;
  matches?: RegExp | { pattern: RegExp; message?: string };
};

export type NumberOptions = BaseOptions & {
  type: 'number';
  isPositive?: MessageOption;
  isInt?: MessageOption;
};

export type BooleanOptions = BaseOptions & {
  type: 'boolean';
};

export type ObjectOptions = BaseOptions & {
  type: 'object';
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
type ClassType = Function | [Function];

export type ClassOptions = BaseOptions & {
  type: ClassType;
};

export type EnumOptions = BaseOptions & {
  type?: undefined;
  enum: Record<string, unknown> | readonly string[] | string[];
  enumMessage?: string;
};

export type NoTypeOptions = BaseOptions & {
  type?: undefined;
  enum?: undefined;
};

export type ApiPropertyOptions =
  | StringOptions
  | NumberOptions
  | BooleanOptions
  | ObjectOptions
  | EnumOptions
  | ClassOptions
  | NoTypeOptions;
