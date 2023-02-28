import React, { useState, useEffect, useContext } from 'react';
import { Column, ColumnCentered, ColumnSpaced, form_header, form_info, form_selectable, Row, RowSpaced } from '../../tools/global_components';
import styles from '../../styles/components/screens/Create.module.scss';
import { get_users_communities, get_users_history, get_users_upcoming, get_user_data } from '../../firebase/methods/User_Functions';
import { ProfileDataContext } from '../../contexts/ProfileData.context';
import Loader from '../UI/Loader';
import { SideLeft, SideRight, SideUp } from '../wrappers/Animations';
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
import { add_invite, create_event, get_event_data } from  '../../firebase/methods/Event_Functions';
import { event_date_full } from '../../tools/DateTime_Methods';
import moment from 'moment';
import { get_event_image, upload_event_image } from '../../firebase/methods/Storage_Functions';
import User from '../previews/User';
import Stepper from '../items/Stepper';



function Create_Event(props) {
    const [id, set_id] = useState(generatePushID());
    const [selected, set_selected] = useState(0);
    const [status, set_status] = useState("");
    const [loader, set_loader] = useState(false);
    const [page_loader, set_page_loader] = useState(true);
    const { user } = useContext(AuthContext);
    const { groups, user_profile } = useContext(ProfileDataContext)
    const [list, set_list] = useState([]);
    const default_image = "https://firebasestorage.googleapis.com/v0/b/forage-212715.appspot.com/o/default-image.png?alt=media&token=a420c3be-5332-4396-9369-f5853c6ed3f2";

    const [groups_data, set_groups_data] = useState([]);
    const [groups_events_data, set_groups_events_data] = useState([]);
    const [selected_group, set_selected_group] = useState(null);


    const [date_selected, set_date_selected] = useState(moment().startOf('day').format('X'));
    const [address_input, set_address_input] = useState(null);
    const [geo_input, set_geo_input] = useState(null)
    const [private_status, set_private_status] = useState(null);
    const [name_input, set_name_input] = useState("");
    const [details_input, set_details_input] = useState("");
    const [available_spots, set_available_spots] = useState(15);
    const [image, set_image] = useState(default_image);
    const [template_image, set_template_image] = useState(false);
    const [preview_image, set_preview_image] = useState(default_image);
    const [time_input, set_time_input] = useState("09:00");

    const [created_data, set_created_data] = useState({});

    // DELETE 

    useEffect(() => {
        const fetch_data = async () => {
            set_groups_data(groups.filter(item => item.mods.includes(user) || item.admin === user))
            set_page_loader(false);
        };
        fetch_data();
    }, []);

    if(page_loader) { return <h2>hi</h2> };

    
    const upload_handler = async () => {
        await upload_event_image(image, id);
        return await get_event_image(id);
    };

    const create_new_event = async () => {
       
        //const image_data = template_image ? template_image : image === default_image ? default_image : await upload_handler();
        const image_data = image === default_image && template_image ? template_image : image === default_image ? default_image : await upload_handler();
        set_loader(true);
        try {
            create_event({
                name: name_input,
                details: details_input,
                address: address_input,
                slots: Number(available_spots),
                private_status: private_status === 0 ? false : true,
                date: date_selected.format('YYYY-MM-DD'),
                time: time_input,
                group_id: selected_group ? selected_group.id : null,
                image: image_data,
                id: id,
                geo: geo_input,
                admin: user
            }).then(async () => {
                const d = await get_event_data(id);
                set_created_data(d);
                set_loader(false);
                set_selected(6);
            })
        } catch(error) {
            console.log(error)
            set_status(error);
            set_loader(false);
        }
    };


    const load_template_events = async (item) => {
        const template_data = await get_groups_templates(item.id);
        set_selected_group(item);
        set_address_input(item.location);
        set_geo_input(item.geo_input);
        if(template_data.length === 0) {
            set_selected(2)
        } else {
            set_groups_events_data(template_data);
            set_selected(1)
        }
    };

    const load_template_handler = (item) => {
        set_name_input(item.name);
        set_private_status(item.private_status);
        set_available_spots(item.slots);
        set_preview_image(item.image);
        set_template_image(item.image);
        set_details_input(item.details);
        set_address_input(item.location);
        set_geo_input(item.coordinates)
        set_selected(5);
    };

    const next_active_handler = () => {
        if(selected === 2) return name_input.length >= 3 && name_input.length < 30 && available_spots > 0 && private_status === 0 || private_status === 1;
        if(selected === 4) return geo_input && address_input;
        return true;
    }

    const continue_handler = () => set_selected(selected + 1);

    const back_handler = () => {
        if(selected === 0) { props.close(); return }
        if(selected === 2) { set_selected(0); return  } 
        set_selected(selected - 1);
    }

    const button_handler = () => {
        if(selected === 0) return <Button_Main action={() => set_selected(2)}>Skip</Button_Main>
        if(selected === 1) return <Button_Main action={continue_handler}>Skip</Button_Main>
        if(selected === 5) return <Button_Main loader={loader} active={next_active_handler()} action={create_new_event}>Create</Button_Main>
        if(selected === 6) return <Button_Main action={invite_handler}>Send Invites</Button_Main>
        return <Button_Main active={next_active_handler()} action={continue_handler}>Next</Button_Main>
    };

    const invite_handler = async () => {
        // list.forEach(item => console.log(item.id))
        list.forEach(item => add_invite(item.id, created_data))
        props.close();
    }


    const steps = ["Setup", null, "Profile", "Details", "Location", "Date & Time"];

    const assign = (
        <Column gap={1}>
            <Column fixed={true}>
                <h2 className={styles.title}>Select a Community to assign to this Event.</h2>
                <small className='medium'>Or skip and don't assign to any Community</small>
            </Column>
            <Column gap={0}>
                {groups_data.map(item => <Preview data={item} select={load_template_events} />)}
            </Column>
        </Column> 
    );

    const templates = (
        <Column gap={1}>
            <Column fixed={true}>
                <h2 className={styles.title}>Select a previous Event to re-make it.</h2>
                <small className='medium'>Or skip and create a brand new Event</small>
            </Column>
            <Column gap={0}>
                {groups_events_data.map(item => <Preview data={item} select={load_template_handler} />)}
            </Column>
        </Column>
    );

    const profile = ( 
            <Column gap={3}>
                <Column fixed={true}>
                    <h2 className={styles.title}>Build your Events profile</h2>
                    <small className='medium'>Fill in the name, amount of available places and select an image and whether it's private or open.</small>
                </Column>
                <Row gap={2}>
                    <Upload_Image value={preview_image} preview={(e) => set_preview_image(e)} file={set_image}  />
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
        <Column gap={3}>
            <Column fixed={true}>
                <h2 className={styles.title}>Provide some details about your Event.</h2>
                <small className='medium'>Fill in anything you think people should know.</small>
            </Column>
            <Textarea_Input height={"50rem"} value={details_input} input={set_details_input}>Details</Textarea_Input>
        </Column>            
    );

    const location = (
        <Column gap={3}>
            <Column fixed={true}>
                <h2 className={styles.title}>Provide the address your Event is taking place.</h2>
                <small className='medium'>Start typing to select a location.</small>
            </Column>
            <GoogleAddress address={address_input} set_address={set_address_input} geo={set_geo_input} />
        </Column>   
    );

    const date_time = (
        <Column gap={3}>
            <Column fixed={true}>
                <h2 className={styles.title}>When is the date and start time of your Event?</h2>
                <small className='medium'>Select the date and time.</small>
            </Column>
            <section className={styles.datetime}>
                <Calendar new={true} data={[]} set_date={set_date_selected} />
                <Time_Input value={time_input} set_time={set_time_input} />
            </section>
        </Column>     
    );

    const invites = (     
        <Column>
            <h2 className={styles.title}>Congratulations your event has been created! Now it's time to send out invites.</h2>
            <Column gap={5} fixed={true}>
               {created_data.group_id ? (
               <Column gap={2}>
                    <h4>Members</h4>
                    <Row gap={0.5}>
                        {created_data.organiser.members.filter(item => !created_data.members.includes(item)).map(item => <User key={item + 3} id={item} select={set_list} list={list}  />)}
                    </Row>
                </Column>
                ) : null}
                <Column gap={2}>
                    <h4>Friends</h4>
                    <Row gap={0.5}>
                        {/* {user_profile.friends.filter(item => !created_data.members.includes(item)).map(item => <User key={item + 3} id={item} select={set_list} list={list}  />)} */}
                    </Row>
                </Column>
            </Column>
        </Column>         
    );


    const content = [assign, templates, profile, details, location, date_time, invites];


    return ( 
        <SideUp>
            <main className={styles.main}>
                <main className={styles.form}>
                    <section className={styles.side}>
                        <h2>Create your own Event</h2>
                        <Stepper active={false} steps={steps} select={set_selected} selected={selected} />
                    </section>
                <section className={styles.content}>
                    {content[selected]}
                    <section className={styles.actions}>
                        <Icon action={back_handler}><IoChevronBackSharp /></Icon>
                        <span style={{width: "25rem"}}>{button_handler()}</span>
                    </section>

                </section>
                </main> 
            </main>
        </SideUp>
    )
}

export default Create_Event;



const Preview = (props) => (
    <div className={styles.preview} onClick={() => props.select(props.data)}>
        <div className={styles.preview__image} style={{"backgroundImage": `url(${props.data.image})`}}></div>
        <Column fixed={true} gap={0.5}>
            <p class="bold">{props.data.name}</p>
            <p class="medium">{props.data.members.length} members</p>
        </Column>
    </div>
)


// Let's start by setting up some configurations 

//SETUP
// association 
// template

//PROFILE
// name 
// image
// slots
// private - public 

// DETAILS 
// details 

// LOCATION
// location

//WHEN
// date
// time
 

// console.log(name_input)
// console.log(details_input)
// console.log(Number(available_spots))
// console.log(private_status === 0 ? false : true);
// console.log(date_selected.format('YYYY-MM-DD'))
// console.log(time_input)
// console.log(selected_group ? selected_group.id : null)
// console.log(formatted_image)
// console.log(id)
// console.log(geo_input)
// console.log(user)
