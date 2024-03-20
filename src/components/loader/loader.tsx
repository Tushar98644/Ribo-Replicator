import styles from './loader.module.css';

export const Loader = () => {
    return (
        <div className={`flex h-screen w-screen justify-center items-center`}>
                <div className={styles.loader}>
                    <div className={styles.loader__bar}></div>
                    <div className={styles.loader__bar}></div>
                    <div className={styles.loader__bar}></div>
                    <div className={styles.loader__bar}></div>
                    <div className={styles.loader__bar}></div>
                    <div className={styles.loader__ball}></div>
                </div>
        </div>
    );
}