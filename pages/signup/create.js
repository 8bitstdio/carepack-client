import { useState, useEffect } from 'react';
import Head from 'next/head'
import { useRouter } from 'next/router';
import {Formik, Field} from 'formik'
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import * as Yup from 'yup'
import { toast } from 'react-toastify';

import Button from '../../components/button';

import styles from '../../styles/Settings.module.scss'
import apiURL, {getLocalURL} from '../../utils/urls';
import { getCookie } from '../../utils/cookies';

export default function EditProfile(props) {
    const [valid, setValid] = useState(false);
    const router = useRouter();
    useEffect(() => {
        const wallet = getCookie('wallet');
        if (isEmpty(wallet)) return router.push('/');
    }, []);

    const EditProfileSchema = Yup.object().shape({
        name: Yup.string()
            .required('Name is required'),
        username: Yup.string()
            .required('Username is required'),
        email: Yup.string()
            .email('Email is invalid'),
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
        const wallet = getCookie('wallet');
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
                description: values.description,
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

    const handleBlur = (err) => () => {
        console.log("error ",err);
        if (isEmpty(err?.username)) {
            setValid(true);
        }
    }

    return (
    <>
        <Head>
            <title>Edit Profile | CarePack: Social Partnerships</title>
            <meta name="description" content="Carepack is Partnership platform" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className={styles.main}>
            <h1 className={styles.heavyText}>Set Up Your Account</h1>
            <Formik
                initialValues={{
                    name: get(props, 'account.name', ''),
                    username: get(props, 'account.username', ''),
                    email: props.account?.email || '',
                    description: get(props, 'account.description', ''),
                }}
                validationSchema={EditProfileSchema}
                validate={values => {
                    const errors = {};
                    console.log('values', values);
                    return values?.username && fetch(`${apiURL}/api/users/username/${values.username}`)
                        .then(res => res.json())
                        .then(json => {
                            if (json.success) {
                                return {
                                    username: 'Username already exists',
                                };
                            }
                            return errors;
                        })
                        .catch(err => {
                            console.log(err);
                            return {};
                        });
                }}
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
                        {renderErrors(errors, touched)}
                        <Field
                            type="text"
                            placeholder='Name'
                            name="name"
                            className={touched.name && errors.name ? `${styles.input} ${styles.error}` : styles.input}
                            onChange={handleChange}
                            value={values.name}
                        />
                        <Field
                            type='text'
                            placeholder='Username'
                            name="username"
                            onBlur={handleBlur(errors)}
                            className={touched.username && errors.username ? `${styles.input} ${styles.error}` : valid ? `${styles.input} ${styles.valid}` : styles.input}
                            onChange={handleChange}
                            value={values.username}
                        />
                        <Field
                            type='email'
                            placeholder='Email'
                            name="email"
                            className={touched.email && errors.email ? `${styles.input} ${styles.error}` : styles.input}
                            onChange={handleChange}
                            value={values.email}
                        />
                        <Button type='primary'>Submit</Button>
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