import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsNullableConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    return value !== undefined;
  }

  defaultMessage(): string {
    return 'Property must be defined (can be null)';
  }
}

export function IsNullable(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsNullableConstraint,
    });
  };
}
