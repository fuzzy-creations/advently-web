import React, { useState, useEffect, useContext } from 'react';
import User from '../../components/previews/User';
import styles from '../../styles/pages/dashboard/Profile.module.scss';
import { Content, FlexList, Header, List, Main, Menu, Section, Side } from '../../components/wrappers/Wrappers';
import { ProfileDataContext } from '../../contexts/ProfileData.context';
import { IoMdLogOut, IoIosSettings } from "react-icons/io";
import { RiEditCircleLine } from "react-icons/ri";
import { IoChevronBackSharp, IoLockClosedOutline } from "react-icons/io5";
import { MdDoNotDisturbOn, MdDoNotDisturbOff } from "react-icons/md";
import { FaTasks, FaChevronDown, FaChevronLeft, FaCog } from "react-icons/fa";
import { AiOutlineSafety, AiOutlineUser } from "react-icons/ai";
import { VscCheck, VscBell } from "react-icons/vsc";
import Icon from '../../components/UI/Icon';
import { Column, ColumnCentered, Row, RowSpaced } from '../../tools/global_components';
import { authenticate_me, change_my_password, update_my_profile } from '../../firebase/methods/User_Functions';
import Upload_Image from '../../components/items/Upload_Image';
import Text_Input from '../../components/inputs/Text_Input';
import Textarea_Input from '../../components/inputs/Textarea_Input';
import { get_avatar, upload_avatar } from '../../firebase/methods/Storage_Functions';
import Button_Main from '../../components/buttons/Button_Main';
import Pressable from '../../components/items/Pressable';
import Potato from '../../components/screens/Profile';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/Auth.context';
import Password_Input from '../../components/inputs/Password_Input';
import { delete_account } from '../../firebase/methods/Delete_Functions';

function Profile() {
    const { user_profile } = useContext(ProfileDataContext);
    const { sign_out } = useContext(AuthContext);
    const history = useNavigate();
    const [selected, set_selected] = useState(0);
    const [avatar, set_avatar] = useState(user_profile.image);
    const [preview, set_preview] = useState(user_profile.image);
    const [name, set_name] = useState(user_profile.name);
    const [about, set_about] = useState(user_profile.about);
    const [loader, set_loader] = useState(false);
    const [status, set_status] = useState("");
    const [show, set_show] = useState(false);

    const notification_handler = (status) => {
        update_my_profile(user_profile.id, {dnd_notifications: status})
        update_my_profile(user_profile.id, {dnd_emails: status})
    };

    const private_handler = (status) => {
        update_my_profile(user_profile.id, { private: status })
    };

    const logout = () => {
        sign_out();
        history("/");
   
     }

    const save_handler = async () => {
        set_loader(true);
        const avatar_data = avatar !== user_profile.image ? await upload_handler() : avatar;
        const name_validated = name.length >= 2 && name.length < 20 ? name : user_profile.name;
        try {
            await update_my_profile(user_profile.id, {name: name_validated, about, image: avatar_data});
            set_selected(0);
            set_loader(false);
        } catch(error) {
            set_status(error.message);
            set_loader(false);
        }
    }

    const upload_handler = async () => {
        await upload_avatar(avatar, user_profile.id);
        return await get_avatar(user_profile.id);
    };

    const main = (
        <main className={styles.panel}>
            <section className={styles.user}>
                <img src={user_profile.image} />
                <h5 class="bold">{user_profile.name}</h5>
                <p class="medium">{user_profile.email}</p>
            </section>
            <Column gap={1.5} fixed={true}>
                <p class="bold">About</p>
                <p class="medium">{user_profile.about}</p>
            </Column>
            <section className={styles.actions}>
                <Icon enable={true} action={() => { set_selected(1); set_status(""); }}><AiOutlineUser /></Icon>
                <Icon enable={true} action={() => { set_selected(2); set_status(""); }}><RiEditCircleLine /></Icon>
            </section>
        </main>
    );

    const edit = (
        <main style={{height: "100%"}}>
            <Row gap={1}>
                <Icon medium={true} action={() => set_selected(0)}><IoChevronBackSharp /></Icon>
                <h4>Edit Profile</h4>
            </Row>
            <section className={styles.edit}>
                <Upload_Image value={preview} preview={(e) => set_preview(e)} file={set_avatar}  />
                <p class="medium">{user_profile.location}</p>
                <Text_Input value={name} input={set_name}>Name</Text_Input>
                <Textarea_Input value={about} input={set_about}>About</Textarea_Input>
                <Button_Main loader={loader} action={save_handler}>Save</Button_Main>
                <p>{status}</p>
            </section>
        </main>
    );

    const settings = (
        <main style={{height: "100%"}}>
             <Row gap={1}>
                <Icon medium={true} action={() => set_selected(0)}><IoChevronBackSharp /></Icon>
                <h4>Settings</h4>
            </Row>
            <section className={styles.settings}>
                
                <Column gap={1} fixed={true}>
                    <Row nowrap={true} gap={2}>
                        <div onClick={() => set_selected(4)} className={styles.manage}><AiOutlineSafety /><small class="medium">Change Password</small></div>
                        <div className={styles.manage} style={{opacity: 0.4, cursor: "not-allowed"}}><AiOutlineUser /><small class="medium">Blocked Users</small></div>
                    </Row>
                </Column>
                <Column gap={1}>
                <div className={styles.toggle} onClick={() => notification_handler(!user_profile.dnd_notifications)}>
                    <VscBell />
                    <small class="medium">Disable notifications</small>
                    <div className={styles.toggle__icon}>{user_profile.dnd_notifications ? <VscCheck /> : null }  </div>
                </div>
            
                <div className={styles.toggle} onClick={() => private_handler(!user_profile.private)}>
                    <IoLockClosedOutline />
                    <small class="medium">Private account</small>
                    <div className={styles.toggle__icon}>{user_profile.private ? <VscCheck /> : null }  </div>
                </div>
            </Column>
                <div className={styles.account}>
                    <Button_Main action={logout}>Logout</Button_Main>
                    <small onClick={() => set_selected(3)}>Delete account</small>
                </div>
            </section>
        
        </main>
    );

    const settings_delete = (
        <main style={{height: "100%"}}>
            <Row gap={1}>
                <Icon medium={true} action={() => set_selected(0)}><IoChevronBackSharp /></Icon>
                <h4>Delete Account</h4>
            </Row>
            <Delete_Account />
        </main>
    );

    const settings_password = (
        <main style={{height: "100%"}}>
            <Row gap={1}>
                <Icon medium={true} action={() => set_selected(0)}><IoChevronBackSharp /></Icon>
                <h4>Change Password</h4>
            </Row>
            <Change_Password />
        </main>
    );

    const content = [main, edit, settings, settings_delete, settings_password]

    return (
        <Main>
            <Content>
                <Section>
                    <Header>Friends</Header>
                    <FlexList>{user_profile.friends.map((item, index) => <User id={item} index={index} />)}</FlexList>
                </Section>
            </Content>
            <Side>
                {content[selected]}
            </Side>
            {show ? <Potato data={user_profile} /> : null}
        </Main>
    )
}

export default Profile;


const Delete_Account = (props) => {
    const { user } = useContext(AuthContext);
    const [authenticated, set_authenticated] = useState(false)
    const [password, set_password] = useState("");
    const [error, set_error] = useState("");
    const [loader, set_loader] = useState(false);

    const delete_handler = async () => {
        set_loader(true);
        try {
            await delete_account(user);
        } catch(error) {
            set_error(error.message)
            set_loader(false);
        }
    }

    const authenticate_user = async () => {
        set_loader(true);
        try {
            await authenticate_me(password);
            set_authenticated(true)
            set_error("");
            set_loader(false);
        } catch(error) {
            set_error(error.message);
            set_loader(false);
        }
       
    }

    return (      
        <section style={{marginTop: "5rem"}}>
        
            { authenticated === true ? (
                    <Column gap={2}>
                        <p>This action is irreversible</p>
                        <Button_Main hollow={true} loader={loader} action={delete_handler}>Delete My Account</Button_Main>
                        <div style={styles.input__wrapper}>
                        </div>
                    </Column>
                ) : (
                    <Column gap={2}>
                        <p style={global.input_light_label}>Please enter your password</p>
                        <Password_Input value={password} input={set_password}>Password</Password_Input>
                        <Button_Main loader={loader} hollow={true} action={authenticate_user}>Continue</Button_Main>
                    </Column>
                )}
            <small>{error}</small>
            
        </section>
    )
};

const Change_Password = (props) => {
    const [authenticated, set_authenticated] = useState(false)
    const [old_password, set_old_password] = useState("");
    const [new_password, set_new_password] = useState("");
    const [error, set_error] = useState("");
    const [loader, set_loader] = useState(false);

    const update_password = async () => {
        set_loader(true);
        try {
            await change_my_password(new_password);
            set_error("Saved");
            set_loader(false);
        } catch(error) {
            set_error(error.message)
            set_loader(false);
        }
    }

    const authenticate_user = async () => {
        set_loader(true);
        try {
            await authenticate_me(old_password);
            set_authenticated(true)
            set_error("");
            set_loader(false);
        } catch(error) {
            set_error(error.message)
            set_loader(false);
        }     
    }


    return (      
        <section style={{marginTop: "5rem"}}>
        
            { authenticated === true ? (
                    <Column gap={2}>
                        <p>Now enter your new password</p>
                        <Password_Input value={new_password} input={set_new_password}>Password</Password_Input>
                        <Button_Main hollow={true} loader={loader} action={update_password}>Save</Button_Main>
                    </Column>
                ) : (
                    <Column gap={2}>
                        <p style={global.input_light_label}>Please enter your password</p>
                        <Password_Input value={old_password} input={set_old_password}>Password</Password_Input>
                        <Button_Main loader={loader} hollow={true} action={authenticate_user}>Continue</Button_Main>
                    </Column>
                )}
            <small>{error}</small>
            
        </section>
    )
};