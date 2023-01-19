import { forwardRef } from 'react'
import styles from './FlexContainer.module.scss'

export const FlexContainer = forwardRef(({ children }, ref) => {
  return (
    <ul ref={ref} className={styles.FlexContainer}>
      {children}
    </ul>
  )
})
