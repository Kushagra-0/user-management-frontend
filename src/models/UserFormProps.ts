import User from "./User";

export default interface UserFormProps {
    onSubmit: (user: User) => void;
    onCancel: () => void;
    initialData: Partial<User>;
}