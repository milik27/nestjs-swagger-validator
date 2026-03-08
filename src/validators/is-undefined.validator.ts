import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsUndefinedConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    return value !== null;
  }

  defaultMessage(): string {
    return 'Property must not be null (can be undefined)';
  }
}

export function IsUndefined(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsUndefinedConstraint,
    });
  };
}
