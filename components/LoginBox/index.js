import {Formik} from 'formik';
import * as Yup from 'yup';
import { Magic } from 'magic-sdk';

import Button from '../button';
import Box from '../box';
import FieldBox from '../field-box';

import styles from './LoginBox.module.scss'

export default function LoginBox(){
    const registerAndLogin = async (values) => {
        try {
            const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_API_KEY);
            const DID = await magic.auth.loginWithMagicLink({
                email: values.email
            });
            await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: values.email,
                    did: DID
                })
            });
        } catch (error) {
            console.error('Something went wrong. ',error);
        }
    };
    return (
        <Box className={styles.box}>
            <h1>Welcome</h1>
            <Formik
                initialValues={{
                    email: '',
                }}
                validationSchema={Yup.object({
                    email: Yup.string().email('Whoops! Please enter a valid email address').required('Email Required'),
                })}
                onSubmit={registerAndLogin}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                }) => (
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <FieldBox
                            error={errors.email}
                            touched={touched.email}
                        >
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                className={styles.input}
                            />
                        </FieldBox>
                        <Button className={styles.btn}>Login</Button>
                    </form>
                )}
            </Formik>
        </Box>
    )
}