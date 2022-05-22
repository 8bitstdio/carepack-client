export default function TextField(props){
    const {
        label,
        name,
        value,
        onChange,
        error,
        ...rest
    } = props;
    
    return (
        <div className={style.group}>
            {label && <label htmlFor={name}>{label}</label>}
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                className={error ? 'form-control is-invalid' : 'form-control'}
                {...rest}
            />
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
}