import styles from "./style.module.css";
export const ErrorMessage = ({ message }: { message: string }) => {
  return <div className={styles.errorMessage}>{message}</div>;
};
