import { useState, useEffect } from 'react';
import Head from 'next/head'
import { useRouter } from 'next/router';
import {Formik, Field} from 'formik'
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import * as Yup from 'yup'
import { toast } from 'react-toastify';

import Button from 'components/button';
import Logo from 'assets/Logo';

import apiURL, {getLocalURL} from 'utils/urls';
import { getCookie } from 'utils/cookies';

import styles from 'styles/Register.module.scss'

export default function EditProfile(props) {
    const [valid, setValid] = useState(false);
    const router = useRouter();

    const checkUsername = async (value)=> {
        try {
            const username = value;
            const response = await fetch(`${getLocalURL()}/api/account/checkUsername?username=${username}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const {success} = await response.json();
            return success;
        } catch(err) {
            console.log(err);
            return false;
        }
    }

    const checkEmail = async (value)=> {
        try {
            const response = await fetch(`${getLocalURL()}/api/account/checkEmail?email=${value}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const {success} = await response.json();
            return success;
        } catch(err) {
            console.log(err);
            return false;
        }
    }

    const EditProfileSchema = Yup.object().shape({
        name: Yup.string()
            .required('Name is required'),
        username: Yup.string()
            .test('unique username', 'Username is already taken', checkUsername)
            .required('Username is required'),
        email: Yup.string()
            .test('unique email', 'Email is already taken', checkEmail)
            .required('Email is required'),
    });

    const renderErrors = (errors, touched) => {
        const touchedItems = Object.keys(touched);
        const errorItems = Object.keys(errors);

        return errorItems.some(i => touchedItems.includes(i)) && (
            <div className={styles.errorSection}>
                <ul>
                    {touchedItems.map((error, index) => {
                        return errors[error] && <li key={index}>{errors[error]}</li>;
                    })}
                </ul>
            </div>
        );
    }

    const handleFormSubmit = (values) => {
        const wallet = getCookie('active_wallet');
        fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                cookie: props.cookie,
            },
            body: JSON.stringify({
                wallet,
                name: values.name,
                username: values.username,
                email: values.email,
            })
        }).then(res => res.json())
        .then(json => {
            if(json.success){
                toast('Account Created', {
                    type: 'success',
                });
                router.push('/welcome');
            }
        });
    }

    return (
    <>
        <Head>
            <title>Edit Profile | CarePack: Social Partnerships</title>
            <meta name="description" content="Carepack is Partnership platform" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className={styles.main}>
            <Formik
                initialValues={{
                    name: get(props, 'account.name', ''),
                    username: get(props, 'account.username', ''),
                    email: get(props, 'account.email', ''),
                }}
                validationSchema={EditProfileSchema}
                validateOnChange={false}
                onSubmit={handleFormSubmit}
            >
                {({
                    handleSubmit,
                    handleChange,
                    values,
                    errors,
                    touched 
                }) => (
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <Logo
                            mainStyle={styles.logo}
                            color="#000"
                        />
                        {renderErrors(errors, touched)}
                        <Field
                            type="text"
                            placeholder='Name'
                            name="name"
                            autoComplete="off"
                            className={touched.name && errors.name ? `${styles.input} ${styles.error}` : styles.input}
                            onChange={handleChange}
                            value={values.name}
                        />
                        <Field
                            type='text'
                            placeholder='Username'
                            name="username"
                            autoComplete="off"
                            className={touched.username && errors.username ? `${styles.input} ${styles.error}` : valid ? `${styles.input} ${styles.valid}` : styles.input}
                            onChange={handleChange}
                            value={values.username}
                        />
                        <Field
                            type='email'
                            placeholder='Email'
                            name="email"
                            autoComplete="off"
                            className={touched.email && errors.email ? `${styles.input} ${styles.error}` : styles.input}
                            onChange={handleChange}
                            value={values.email}
                        />
                        <Button type='primary'>Register</Button>
                    </form>
                )}
            </Formik>
        </div>
    </>
    )
}

export async function getServerSideProps(ctx) {
    const cookie = get(ctx, 'req.headers.cookie', null);
    const res = await fetch(`${getLocalURL()}/api/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            cookie: cookie,
        },
    });
    const data = await res.json();
    console.log('data', isEmpty(data.data));
    if (isEmpty(data.data)) {
        return {
            props: {
                account: {...data},
            },
        };
    }
    return {
        redirect: {
            destination: '/',
            permanent: true,
        }
    }
}