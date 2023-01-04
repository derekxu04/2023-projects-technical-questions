/* eslint-disable react/jsx-key */

import { useState } from "react";
import AlertModal from "../AlertModal";
import styles from "./Table.module.css";

// !!!!!!!!!!!!!!!!!!!!
// TODO is at line 68 !
// !!!!!!!!!!!!!!!!!!!!

interface AlertUpdate {
  date: string,
  update: string
}

interface Alert {
  alert: string,
  status: string,
  updates: AlertUpdate[]
}

export interface TableContents {
  columnTitles: string[],
  rowContents: Alert[]
}

export default function Table() {
  const [contents, useContents] = useState<TableContents>({
    columnTitles: ['Alert', 'Status', 'Updates'],
    rowContents: [
      {
        alert: 'food',
        status: 'good!',
        updates: []
      },
      {
        alert: 'water',
        status: 'low',
        updates: [{ update: 'dropped to 10% below normal', date: '11/11/2022' }]
      },
      {
        alert: 'shelter',
        status: 'terrible :(',
        updates: [{ update: 'slept on cold ground', date: '11/11/2022' }, { update: 'slept on hard concrete', date: '13/11/2022' }]
      },
      {
        alert: 'Done!',
        status: '<derekxu04>',
        updates: []
      }
    ]
  });

  return (
    <>
      <AlertModal contents={contents} useContents={useContents} />
      <div className={styles.myTable}>
        <div className={styles.row}>
          {contents.columnTitles.map((item) => <div className={styles.item} key={item}>{item}</div>)}
        </div>
        {contents.rowContents.map((content, i) => (
          <div data-testid='row' className={styles.row} key={i}>
            <div className={styles.item}>
              {content.alert}
            </div>
            <div className={styles.item}>
              {content.status}
            </div>
            <div className={styles.item}>
              {content.updates.map((item, i) => (
                <div className={styles.updateContainer} key={i}>
                  <div className={styles.updateContent}>{item.update}</div>
                  <div className={styles.updateDate}>{item.date}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
