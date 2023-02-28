import React, { useState, useEffect, useContext } from 'react';
import styles from '../../styles/components/screens/Create.module.scss';
import { Column, ColumnCentered, ColumnSpaced, form_header, form_info, form_selectable, Row, RowSpaced } from '../../tools/global_components';
import generatePushID from '../../tools/IDGenerator';
import Button_Main from '../buttons/Button_Main';
import Text_Input from '../inputs/Text_Input';
import GoogleAddress from '../items/GoogleAddress';
import Upload_Image from '../items/Upload_Image';
import { Content, Header, Main, Section, Side } from '../wrappers/Wrappers';
import { upload_logo, get_logo } from '../../firebase/methods/Storage_Functions';
import { AuthContext } from '../../contexts/Auth.context';
import { FaUsers } from "react-icons/fa";
import Stepper from '../items/Stepper';
import Icon from '../UI/Icon';
import { IoChevronBackSharp } from "react-icons/io5";
import { ProfileDataContext } from '../../contexts/ProfileData.context';
import User from '../previews/User';
import { add_invite, make_group_mod, remove_group_mod, remove_invite, remove_member, update_my_group } from '../../firebase/methods/Group_Functions';
import { delete_event, delete_group } from '../../firebase/methods/Delete_Functions';
import { useNavigate } from 'react-router-dom';



function Edit_Community(props) {
    const { user } = useContext(AuthContext);
    const { user_profile } = useContext(ProfileDataContext);
    const data = props.data;
    const navigate = useNavigate();


    const [name_input, set_name_input] = useState(data.name);
    const [location_input, set_location_input] = useState(data.location);
    const [geo_input, set_geo_input] = useState(data.coordinates);
    const [about_input, set_about_input] = useState(data.about);
    const [logo, set_logo] = useState(data.image);
    const [preview, set_preview] = useState(data.image);
    const [community_type, set_community_type] = useState(data.type);
    
    const [status, set_status] = useState("");
    const [selected, set_selected] = useState(0);
    const [loader, set_loader] = useState(false);
    const [list, set_list] = useState([]);
    


    const upload_handler = async () => {
        await upload_logo(logo, data.id);
        return await get_logo(data.id);
    };

    const save_profile = async () => {
        const image_data = logo !== data.image ? await upload_handler() : data.image;
        set_loader(true);
        try {
            await update_my_group(data.id, {image: image_data, name: name_input, about: about_input, location: location_input, geo: geo_input});
            set_status("Saved")
            props.close()
        } catch (error)  {
            set_status(error.message);
            set_loader(false);
        }
    }

    const button_handler = () => {
        if(selected === 0) return <Button_Main size={"25rem"} active={name_input.length >= 2 && name_input.length < 30} action={save_profile}>Save</Button_Main>
        if(selected === 1) return <Button_Main size={"25rem"} action={remove_handler}>Remove Members</Button_Main>
        if(selected === 2) return <Row gap={2}><Button_Main size={"20rem"} action={add_mod_handler}>Promote</Button_Main><Button_Main size={"20rem"} action={remove_mod_handler}>Depromote</Button_Main></Row>
        if(selected === 3) return <Button_Main size={"25rem"} action={remove_invite_handler}>Remove Invites</Button_Main>
        if(selected === 4) return <Button_Main size={"25rem"} action={invite_handler}>Send Invites</Button_Main>
        if(selected === 5) return <Button_Main hollow={true} size={"25rem"} action={delete_handler}>Delete Community</Button_Main>
    }


    const back_handler = () => {
        if(selected === 0) { props.close(); return }
        set_selected(selected - 1);
    }

    const invite_handler = async () => {
        list.forEach(item => add_invite(item.id, data));
        set_list([]);
    };

    const remove_handler = async () => {
        list.forEach(item => remove_member(item.id, data.id));
        set_list([]);
    };

    const remove_invite_handler = async () => {
        list.forEach(item => remove_invite(item.id, data.id));
        set_list([]);
    };

    const add_mod_handler = async () => {
        list.forEach(item => make_group_mod(item.id, data));
        set_list([]);
    };
    
    const remove_mod_handler = async () => {
        list.forEach(item => remove_group_mod(item.id, data));
        set_list([]);
    };

    const delete_handler = async () => {
        navigate("/communities")
        await delete_group(data.id);
    };


    const form = (
        <Column gap={3}>
            <h2>Profile</h2>
            <Row gap={2}>
                <Upload_Image value={preview} preview={(e) => set_preview(e)} file={set_logo}  />
                {form_header("Logo", "Upload your Community's logo.")}
            </Row>
            <Column fixed={true} gap={1}>
                {form_header("Name", "Fill in the name of your Community.")}
                <Text_Input value={name_input} input={set_name_input}>Name</Text_Input>
            </Column>
            <Column fixed={true} gap={1}>
                {form_header("Type", "Fill in the name of your Community.")}
                {form_selectable(community_type, 0, "Private", set_community_type )}
                {form_selectable(community_type, 1, "Charity", set_community_type )}
                {form_selectable(community_type, 2, "Community", set_community_type )}
                {form_selectable(community_type, 3, "Business", set_community_type )}
            </Column>
            <Column fixed={true} gap={1}>
                {form_header("Location", "Enter your location.")}
                <GoogleAddress address={location_input} set_address={set_location_input} geo={set_geo_input} />
            </Column>
            <Column fixed={true} gap={1}>
                {form_header("About", "Write a short description.")}
                <Text_Input value={about_input} input={set_about_input}>About</Text_Input>
            </Column>
        </Column>
    );

    const members = (
        <Column gap={2}>
            <h2>Members</h2>
            <Row gap={0.5}>
                {data.members.map(item => <User key={item + 1} id={item} select={set_list} list={list} />)}
            </Row>
        </Column>
    );

    const moderators = (
        <Column gap={2}>
            <h2>Moderators</h2>
            <Row gap={0.5}>
                {data.mods.filter(item => item !== data.admin).map(item => <User key={item + 4} id={item} select={set_list} list={list} />)}
            </Row>
            <h2>Members</h2>
            <Row gap={0.5}>
                {data.members.filter(item => !data.mods.includes(item) && item !== data.admin).map(item => <User key={item + 5} id={item} select={set_list} list={list} />)}
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
        <Column gap={5}>
            <h2>Send Invites</h2>
            <Column gap={2} fixed={true}>
                <h4>Friends</h4>
                <Row gap={0.5}>
                    {user_profile.friends.filter(item => !data.members.includes(item) && !data.invites.includes(item)).map(item => <User key={item + 3} id={item} select={set_list} list={list}  />)}
                </Row>
            </Column>
        </Column> 
    );

    const deleted = (
        <Column gap={5}>
            <h2>Delete Community</h2>
            <small>This action is irreversible.</small>
        </Column> 
    );

    const steps = ["Profile", "Members", "Moderators", "Invited", "Send Invites", data.admin === user ? "Delete" : null];
    const content = [form, members, moderators, invited, invites, data.admin === user ? deleted : null]

   
    return ( 
        <main className={styles.main}>
            <main className={styles.form}>
            <section className={styles.side}>
                <h2>Edit Community</h2>
                <Stepper steps={steps} select={set_selected} selected={selected} />
            </section>
            <section className={styles.content}>
                {content[selected]}
                <section className={styles.actions}>
                    <Icon action={back_handler}><IoChevronBackSharp /></Icon>
                    {button_handler()}
                </section>
            </section>
            </main> 
        </main>
    )
}


export default Edit_Community;


const Preview = (props) => (
    <div className={styles.preview} onClick={() => props.select()}>
        <div className={styles.preview__image}><FaUsers /></div>
        <Column fixed={true} gap={0.5}>
            <p class="bold">{props.name}</p>
            <p class="medium">{props.children}</p>
        </Column>
    </div>
)

