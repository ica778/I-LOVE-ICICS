import React from 'react'
import styles from './UserProfile.module.scss';

const UserProfile = () => {
  return (
    <div className={styles.container}>
      <div className={styles.article}>
        <span className={styles.header}>
          Your Sentences
        </span>
        <p className={styles.content}>
           Example Text
        </p>
      </div>

      <div className={styles.article}>
        <span className={styles.header}>
          Your Comments
        </span>
        <p className={styles.content}>
            Example Text
        </p>
      </div>
    </div>
  )
}

export default UserProfile