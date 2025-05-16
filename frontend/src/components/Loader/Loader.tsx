import './Loader.css';

type LoaderProps = {
    size?: 'small' | 'medium' | 'large';
    color?: string;
};

export const Loader = ({ size = 'medium', color }: LoaderProps) => {
    const sizeMap = {
        small: '20px',
        medium: '40px',
        large: '60px'
    };

    const loaderStyle = {
        width: sizeMap[size],
        height: sizeMap[size],
        borderColor: color ? `${color} transparent transparent transparent` : undefined
    };

    return (
        <div className="loader-container">
            <div className="loader" style={loaderStyle} />
            <div className="loader-text">Загрузка...</div>
        </div>
    );
};
