import { useContext, useState } from "react";
import moment from "moment";
import { date_after, event_preview_array_format } from "../../tools/DateTime_Methods";
import { Column } from "../../tools/global_components";
import { format_events } from "../../tools/Global_Functions";
import Calendar from "./Calendar";
import { ProfileDataContext } from "../../contexts/ProfileData.context";
import Side_Preview from "../previews/Side";


function Side_Calendar (props) {
    const { upcoming, history } = useContext(ProfileDataContext);
    const [date, set_date] = useState(moment());

    const calendar_dates = [...upcoming, ...history].filter(item => date_after(item.start.seconds, date));

    return (
        <>
        <h2>{props.children}</h2>
            <Calendar data={[...upcoming, ...history]} set_date={set_date} />
            <Column gap={1.5} fixed={true}>
                {format_events(calendar_dates.slice(0, 3)).map(item => {
                    return (
                        <Column gap={1.5} fixed={true}>
                            <h5 class="bold">{event_preview_array_format(item.date)}</h5>
                            {item.events.map(item => <Side_Preview data={item} />)}
                        </Column>
                    )
                })}
            </Column>
        </>
    )
}

export default Side_Calendar