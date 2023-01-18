import classNames from 'classnames'
import styles from './Wrapper.module.scss'

export function Wrapper({ children, center, style }) {
  return (
    <div
      className={classNames(styles.Wrapper, center && styles.center)}
      style={style}
    >
      {children}
    </div>
  )
}
