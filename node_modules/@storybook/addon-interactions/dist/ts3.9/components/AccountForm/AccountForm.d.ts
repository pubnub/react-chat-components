import { FC } from 'react';
export interface AccountFormResponse {
    success: boolean;
}
export interface AccountFormValues {
    email: string;
    password: string;
}
export declare type AccountFormProps = {
    passwordVerification?: boolean;
    onSubmit?: (values: AccountFormValues) => void;
    onTransactionStart?: (values: AccountFormValues) => void;
    onTransactionEnd?: (values: AccountFormResponse) => void;
};
export declare const AccountForm: FC<AccountFormProps>;
