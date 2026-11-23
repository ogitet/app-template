import type { ReactNode } from 'react';

import styles from './Header.module.css';

/** 画面上部の見出し。left と right には、戻る・削除などの操作を置く。 */
export function Header({
  left,
  title,
  right,
}: {
  left?: ReactNode;
  title: ReactNode;
  right?: ReactNode;
}) {
  return (
    <header className={styles.root}>
      <div>{left}</div>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.right}>{right}</div>
    </header>
  );
}
