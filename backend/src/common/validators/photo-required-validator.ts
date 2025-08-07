import { FileValidator } from '@nestjs/common';

export class PhotosRequiredValidator extends FileValidator {
    constructor(options) {
        super(options);
    }

    public isValid(files: any): boolean {
        if (Array.isArray(files)) {
            return files.length > 0;
        } else {
            return !!files;
        }
    }

    public buildErrorMessage(file: any): string {
        return this.defaultMessage;
    }

    public get defaultMessage(): string {
        return 'At least one photo is required';
    }
}
