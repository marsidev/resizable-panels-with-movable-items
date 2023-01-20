import { forwardRef } from 'react'
import styles from './GridContainer.module.scss'

export const GridContainer = forwardRef(({ children, columns }, ref) => {
  return (
    <ul
      ref={ref}
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
})
