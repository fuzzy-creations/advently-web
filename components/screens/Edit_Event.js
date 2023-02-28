import React, { useState, useEffect, useContext } from 'react';
import { Column, ColumnCentered, ColumnSpaced, form_header, form_info, form_selectable, Row, RowSpaced } from '../../tools/global_components';
import styles from '../../styles/components/screens/Create.module.scss';
import { get_users_communities, get_users_history, get_users_upcoming, get_user_data } from '../../firebase/methods/User_Functions';
import { ProfileDataContext } from '../../contexts/ProfileData.context';
import Loader from '../UI/Loader';
import { SideRight, SideUp } from '../wrappers/Animations';
import Pressable from '../items/Pressable';
import User_Action_Button from '../buttons/User_Action_Button';
import { Link, useNavigate } from 'react-router-dom';
import { IoChevronBackSharp, IoChatbubbleOutline, IoLockClosedOutline, IoCheckmarkCircleSharp, IoEllipseOutline, IoEllipseSharp } from "react-icons/io5";
import Icon from '../UI/Icon';
import { AuthContext } from '../../contexts/Auth.context';
import { get_chat_id } from '../../tools/Global_Functions';
import { create_chat } from '../../firebase/methods/Message_Functions';
import generatePushID from '../../tools/IDGenerator';
import { Content, Header, Main, Section, Side } from '../wrappers/Wrappers';
import GoogleAddress from '../items/GoogleAddress';
import Text_Input from '../inputs/Text_Input';
import { get_groups_templates } from '../../firebase/methods/Group_Functions';
import Button_Main from '../buttons/Button_Main';
import Upload_Image from '../items/Upload_Image';
import Textarea_Input from '../inputs/Textarea_Input';
import Calendar from '../items/Calendar';
import Number_Input from '../inputs/Number_Input';
import Time_Input from '../inputs/Time_Input';
import { add_invite, create_event, remove_invite, remove_joiner, update_my_event, make_event_mod, remove_event_mod } from  '../../firebase/methods/Event_Functions';
import { event_date_full } from '../../tools/DateTime_Methods';
import moment from 'moment';
import { get_event_image, upload_event_image } from '../../firebase/methods/Storage_Functions';
import User from '../previews/User';
import Stepper from '../items/Stepper';
import { delete_event } from '../../firebase/methods/Delete_Functions';



function Edit_Event(props) {
    const { user } = useContext(AuthContext);
    const { user_profile } = useContext(ProfileDataContext);
    const data = props.data;
    const [selected, set_selected] = useState(0);
    const [status, set_status] = useState("");
    const [loader, set_loader] = useState(false);

    const navigate = useNavigate();


    const [date_selected, set_date_selected] = useState(data.start.seconds);
    const [address_input, set_address_input] = useState(data.location);
    const [geo_input, set_geo_input] = useState(data.coordinates)
    const [private_status, set_private_status] = useState(data.private_status ? 1 : 0);
    const [name_input, set_name_input] = useState(data.name);
    const [details_input, set_details_input] = useState(data.details);
    const [available_spots, set_available_spots] = useState(data.slots);
    const [image, set_image] = useState(data.image);
    const [formatted_image, set_formatted_image] = useState(data.image);
    const [time_input, set_time_input] = useState(data.time);
    const [list, set_list] = useState([]);


    console.log(data)

    useEffect(() => {
        set_list([]);
    }, [selected])


    
    const upload_handler = async () => {
        await upload_event_image(formatted_image, data.id);
        return await get_event_image(data.id);
    };

    const save_profile = async () => {
        const image_data = image !== data.image ? await upload_handler() : data.image;
        set_loader(true);
        try {
            await update_my_event(data.id, {image: image_data, name: name_input, private_status: [false, true][private_status], slots: available_spots});
            set_status("Saved")
            props.close(false)
        } catch (error)  {
            set_status(error.message);
            set_loader(false);
        }
    }

    const save_details = async () => {
        set_loader(true);
        try {
            await update_my_event(data.id, {details: details_input});
            set_status("Saved")
            props.close(false)
        } catch (error)  {
            set_status(error.message);
            set_loader(false);
        }
    }

    const save_location = async () => {
        set_loader(true);
        try {
            await update_my_event(data.id, {location: address_input, geo: geo_input});
            set_status("Saved")
            props.close(false)
        } catch (error)  {
            set_status(error.message);
            set_loader(false);
        }
    }

    const save_time = async () => {
        set_loader(true);
        try {
            await update_my_event(data.id, {date: date_selected.format('YYYY-MM-DD'), time: time_input});
            set_status("Saved")
            props.close(false)
        } catch (error)  {
            set_status(error.message);
            set_loader(false);
        }
    }

    
    const invite_handler = async () => {
        list.forEach(item => add_invite(item.id, data));
        set_list([]);
    };

    const remove_handler = async () => {
        list.forEach(item => remove_joiner(item.id, data.id));
        set_list([]);
    };

    const remove_invite_handler = async () => {
        list.forEach(item => remove_invite(item.id, data.id));
        set_list([]);
    };

    const add_mod_handler = async () => {
        list.forEach(item => make_event_mod(item.id, data));
        set_list([]);
    };
    
    const remove_mod_handler = async () => {
        list.forEach(item => remove_event_mod(item.id, data));
        set_list([]);
    };

    const delete_handler = async () => {
        await delete_event(data.id);
        navigate("/")
    };




    const button_handler = () => {
        if(selected === 0) return <Button_Main size={"25rem"} active={name_input.length >= 2 && name_input.length < 30} action={save_profile}>Save</Button_Main>
        if(selected === 1) return <Button_Main size={"25rem"} action={save_details}>Save</Button_Main>
        if(selected === 2) return <Button_Main size={"25rem"} action={save_location}>Save</Button_Main>
        if(selected === 3) return <Button_Main size={"25rem"} action={save_time}>Save</Button_Main>
        if(selected === 4) return <Row gap={2}><Button_Main size={"20rem"} action={add_mod_handler}>Promote</Button_Main><Button_Main hollow={true} size={"20rem"} action={remove_handler}>Remove</Button_Main></Row>
        if(selected === 5 && data.admin === user) return <Button_Main size={"25rem"} action={remove_mod_handler}>Depromote</Button_Main>
        if(selected === 6) return <Button_Main size={"25rem"} action={remove_invite_handler}>Cancel Invite</Button_Main>
        if(selected === 7) return <Button_Main size={"25rem"} action={invite_handler}>Send Invites</Button_Main>
        if(selected === 8) return <Button_Main hollow={true} size={"25rem"} action={delete_handler}>Delete Event</Button_Main>
    }


    const profile = ( 
        <Column gap={3}>
            <h2>Profile</h2>
            <Row gap={2}>
                <Upload_Image value={image} preview={(e) => set_image(e)} file={set_formatted_image}  />
                {form_header("Image", "Upload an image for your Event.")}
            </Row>
            <Column fixed={true}>
                {form_header("Name", "Fill in the name of your Community.")}
                <Text_Input value={name_input} input={set_name_input}>Name</Text_Input>
            </Column>
            <Column fixed={true} gap={1}>
                {form_header("Type", "Select whether you want your Event to be visible.")}
                {form_selectable(private_status, 0, "Open", set_private_status )}
                {form_selectable(private_status, 1, "Private", set_private_status )}
            </Column>
            <Column fixed={true}>
                {form_header("Available Places", "Select the maximum capacity.")}
                <Number_Input value={available_spots} input={set_available_spots}>Spots</Number_Input>
            </Column>
        </Column>       
    );

    const details = (
        <Column  gap={1}>
            <h2>Details</h2>
            {form_header("", "Fill in anything you think people should know.")}
            <Textarea_Input height={"50rem"} value={details_input} input={set_details_input}>Details</Textarea_Input>
        </Column>
    );

    const location = (
        <Column  gap={1}>
            <h2>Location</h2>
            <p>{data.location}</p>
            {form_header("", "Start typing to select a location.")}
            <GoogleAddress address={address_input} set_address={set_address_input} geo={set_geo_input} />
        </Column>
    );

    const date_time = (
        <Column gap={2}>
            <h2>Date & Time</h2>
            <section className={styles.datetime}>
                <Calendar adjust={date_selected} new={true} data={[]} set_date={set_date_selected} />
                <Time_Input value={time_input} set_time={set_time_input} />
            </section>
        </Column>
    );

    const members = (
        <Column gap={2}>
            <h2>Members</h2>
            <Row gap={0.5}>
                {data.members.filter(item => !data.mods.includes(item) && item !== data.admin).map(item => <User key={item + 1} id={item} select={set_list} list={list} />)}
            </Row>
        </Column>
    );

    const moderators = (
        <Column gap={2}>
            <h2>Moderators</h2>
            <Row gap={0.5}>
                {data.mods.filter(item => item !== data.admin).map(item => <User key={item + 4} id={item} select={set_list} list={list} />)}
            </Row>
        </Column>
    );

    const invited = (
        <Column gap={2}>
            <h2>Invited</h2>
            <Row gap={0.5}>
                {data.invites.map(item => <User key={item + 2} id={item} select={set_list} list={list} />)}
            </Row>
        </Column>
    );

    const invites = (
        <Column gap={2}>
            <h2>Send Invites</h2>
            {data.organiser.members ? (
            <Column gap={2} fixed={true}>
                <h4>Community Members</h4>
                <Row gap={0.5}>
                    {data.organiser.members.filter(item => !data.members.includes(item) && !data.invites.includes(item)).map(item => <User key={item + 3} id={item} select={set_list} list={list}  />)}
                </Row>
            </Column>
            ) : null}
            <Column gap={2} fixed={true}>
                <h4>Friends</h4>
                <Row gap={0.5}>
                    {user_profile.friends.filter(item => !data.members.includes(item) && !data.invites.includes(item)).map(item => <User key={item + 6} id={item} select={set_list} list={list}  />)}
                </Row>
            </Column>
        </Column> 
    );

    const deleted = (
        <Column gap={5}>
            <h2>Delete Event</h2>
            <small>This action is irreversible.</small>
        </Column> 
    );


    const content = [profile, details, location, date_time, members, moderators, invited, invites, data.admin === user ? deleted : null];
    const steps = ["Profile", "Details", "Location", "Date & Time", "Members", "Moderators", "Invited", "Send Invites", data.admin === user ? "Delete" : null];


    return ( 
        <main className={styles.main}>
            <section className={styles.form}>
                <section className={styles.side}>
                    <h2>Edit Event</h2>
                    <Stepper steps={steps} select={set_selected} selected={selected} />
                </section>
                <section className={styles.content}>
                    {content[selected]}
                    <section className={styles.actions}>
                        <Icon ><IoChevronBackSharp /></Icon>
                        {button_handler()}
                    </section>
                </section>
            </section>
        </main>
    )
}

export default Edit_Event;