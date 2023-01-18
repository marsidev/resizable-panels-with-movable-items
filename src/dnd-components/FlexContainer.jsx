import styles from './FlexContainer.module.scss'

export function FlexContainer({ children }) {
  return (
    <ul className={styles.FlexContainer}>
      {children}
    </ul>
  )
}
