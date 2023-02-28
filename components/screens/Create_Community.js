import React, { useState, useEffect, useContext } from 'react';
import styles from '../../styles/components/screens/Create.module.scss';
import { Column, ColumnCentered, ColumnSpaced, form_header, form_info, Row, RowSpaced } from '../../tools/global_components';
import generatePushID from '../../tools/IDGenerator';
import Button_Main from '../buttons/Button_Main';
import Text_Input from '../inputs/Text_Input';
import GoogleAddress from '../items/GoogleAddress';
import Upload_Image from '../items/Upload_Image';
import { Content, Header, Main, Section, Side } from '../wrappers/Wrappers';
import { upload_logo, get_logo } from '../../firebase/methods/Storage_Functions';
import { AuthContext } from '../../contexts/Auth.context';
import { FaUsers, FaUserLock, FaCheckDouble, FaGlobeAfrica } from "react-icons/fa";
import Stepper from '../items/Stepper';
import Icon from '../UI/Icon';
import { IoChevronBackSharp, IoChatbubbleOutline, IoLockClosedOutline, IoCheckmarkCircleSharp, IoEllipseOutline, IoEllipseSharp } from "react-icons/io5";
import { TbHeartHandshake } from "react-icons/tb";
import { create_group } from '../../firebase/methods/Group_Functions';
import { SideUp } from '../wrappers/Animations';



function Create_Community(props) {
    const { user } = useContext(AuthContext);
    const [id, set_id] = useState(generatePushID())
    const [name_input, set_name_input] = useState("");
    const [loader, set_loader] = useState(false);
    const [location_input, set_location_input] = useState("");
    const [geo_input, set_geo_input] = useState(null);
    const [about_input, set_about_input] = useState("");
    const default_image = "https://firebasestorage.googleapis.com/v0/b/forage-212715.appspot.com/o/default-image.png?alt=media&token=a420c3be-5332-4396-9369-f5853c6ed3f2";
    const [logo, set_logo] = useState(default_image);
    const [preview, set_preview] = useState(default_image);
    const [status, set_status] = useState("");
    const [community_type, set_community_type] = useState(null);
    const [selected, set_selected] = useState(0);
    


    const upload_handler = async () => {
        await upload_logo(logo, id);
        return await get_logo(id);
    };

    const save_handler = async () => {
        const logo_data = logo === default_image ? default_image : await upload_handler();
        try {
            create_group({name: name_input, type: community_type, about: about_input, user_id: user, logo: logo_data, location: location_input, geo: geo_input, id: id})
            props.close()
        } catch(error) {
            set_loader(false);
            set_status(error.message);
        }
    };

    const back_handler = () => {
        if(selected === 0) { props.close(); return }
        set_selected(selected - 1);
    };

    const _type = (
        <Column gap={3}>
            <Column fixed={true}>
                <h2 className={styles.title}>Build your Community.</h2>
                <small className='medium'>Select the type of Community that best fits you.</small>
            </Column>
            <Column gap={0}>
                <Preview icon={<FaGlobeAfrica />} select={() => { set_selected(1); set_community_type(1); }} name="Charity">For nonprofit organisations seeking volunteers</Preview>
                <Preview icon={<FaUsers />} select={() => { set_selected(1); set_community_type(2); }} name="Community">Looking to start something new and host community activities</Preview>
                <Preview icon={<FaCheckDouble />} select={() => { set_selected(1); set_community_type(3); }} name="Business">Offering free classes, promotions or simply hosting something fun</Preview>
                <Preview icon={<FaUserLock />} select={() => { set_selected(1); set_community_type(0); }} name="Private">For events with your friends, this group will not be discoverable</Preview>
            </Column>
        </Column>
    );

    const form = (
        <Column gap={2}>
            <Column fixed={true}>
                <h2 className={styles.title}>Community Profile</h2>
                <small className='medium'>Fill in the name, about, location and add a Logo.</small>
            </Column>
            <Row gap={2}>
                <Upload_Image value={preview} preview={(e) => set_preview(e)} file={set_logo}  />
                {form_header("Logo", "Upload your Community's logo.")}
            </Row>
            {form_header("Name", "Fill in the name of your Community.")}
            <Text_Input value={name_input} input={set_name_input}>Name</Text_Input>
            {form_header("About", "Write a short description.")}
            <Text_Input value={about_input} input={set_about_input}>About</Text_Input>
            {form_header("Location", "Enter your location.")}
            <GoogleAddress address={location_input} set_address={set_location_input} geo={set_geo_input} />
        </Column>
    );

    const content = [_type, form]


    // return (
    // <main className={styles.start}>
    //     <section className={styles.start__wrapper}>
    //         <h1>Create Community</h1>
    //         <p>Communities are the heart of Advently. Create yours to building up your members and host regular Events to the same group of people. Your members will be able to view and discuss with other members and see and be invited to the Community Event activity.</p>
    //         <div>Next</div>
    //     </section>
    // </main>
    
    // )
   
    return ( 
        <SideUp>
            <main className={styles.main}>
                <main className={styles.form}>
                <section className={styles.side}>
                    <h2>Create your own Community</h2>
                    <Stepper active={false} steps={["Type", "Profile"]} select={set_selected} selected={selected} />
                </section>
                <section className={styles.content}>
                    {content[selected]}
                    <section className={styles.actions}>
                        <Icon action={back_handler}><IoChevronBackSharp /></Icon>
                        {selected === 0 ? null : <span style={{width: "25rem"}}><Button_Main active={name_input.length >= 3 && name_input.length < 30 && geo_input && location_input} action={save_handler}>Create</Button_Main></span>}
                    </section>
                </section>
                </main> 
            </main>

        </SideUp>
    )
}


export default Create_Community;


const Preview = (props) => (
    <div className={styles.preview} onClick={() => props.select()}>
        <div className={styles.preview__icon}>{props.icon}</div>
        <Column fixed={true} gap={0.5}>
            <p class="bold">{props.name}</p>
            <p class="medium">{props.children}</p>
        </Column>
    </div>
)

