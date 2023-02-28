import React, { useState, useEffect, forwardRef, useRef, useImperativeHandle } from 'react';
import moment from 'moment';
import styles from '../../styles/components/items/Calendar.module.scss';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { calendar_entry } from '../../tools/DateTime_Methods';


const Calendar = forwardRef((props, ref) => {
    const data = props.data.map(item => item.start.seconds);
    const now = moment();

    const [value, set_value] = useState(0);
    const [calendar, set_calendar] = useState([]);
    const [weekdiff, set_weekdiff] = useState(0);
    const [selected, set_selected] = useState(props.adjust ? moment.unix(props.adjust).startOf('day').format('X') : now.startOf('day').format('X'));

    
    const start = moment().add(value, 'months').startOf('month');
    const start_week = start.clone().startOf('week');
    const end = moment().add(value, 'months').endOf('month');
    const diff = end.diff(start, 'days') + 1;

    
    useEffect(() => {
        const items = [];
        new Array(diff).fill().forEach((item, index) => {
            items.push(moment().add(value, 'months').startOf('month').add(index, 'days'))
        })
        set_weekdiff(items[0].diff(start_week, 'days'))
        set_calendar(items)
    }, [value, props.data])


    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


    const selected_handler = (index) => {
        set_selected(index.startOf('day').format('X'))
        props.set_date(index)   
    }


    return (
        <main>
            <section className={styles.operator}>
                <h5 class="bold">{start.format('MMMM YYYY')}</h5>
                <div>
                    <span onClick={() => set_value(value - 1)}><FaChevronLeft /></span>
                    <span onClick={() => set_value(value + 1)}><FaChevronRight /></span>
                </div>
            </section>
            <section className={styles.calendar}>
                {weekdays.map((day, index) => <div className={styles.weekday}><p class="bold medium">{weekdays[index]}</p></div>)}
                {new Array(weekdiff).fill().map(item => <div></div>)}
                {calendar.map((day, index) => {
                    const invalid = day.isBefore(now) ? true : false;
                    return (
                        <div onClick={props.new && invalid ? null : () => selected_handler(day)} className={`${styles.day} ${invalid ? styles.invalid : null} ${selected === day.format('X') ? styles.selected : null}`}>
                            <p>{day.format('D')}</p>
                            {calendar_entry(data, day) ? <div className={styles.entry}></div> : null}
                        </div>
                    )
                    }
                )}
            </section>
        </main>
    )

})

export default Calendar;