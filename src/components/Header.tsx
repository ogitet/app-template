import type { ReactNode } from "react";

/** 画面上部の見出し。left と right には、戻る・削除などの操作を置く。 */
export function Header({ left, title, right }: { left?: ReactNode; title: ReactNode; right?: ReactNode }) {
  return (
    <header className="hd">
      <div className="hd__l">{left}</div>
      <h1 className="hd__c">{title}</h1>
      <div className="hd__r">{right}</div>
    </header>
  );
}
