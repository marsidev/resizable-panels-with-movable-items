import styles from './GridContainer.module.scss'

export function GridContainer({ children, columns }) {
  return (
    <ul
      className={styles.GridContainer}
      style={
        {
          '--col-count': columns,
        }
      }
    >
      {children}
    </ul>
  )
}
