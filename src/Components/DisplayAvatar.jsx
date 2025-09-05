import React from 'react';
import { useMeData } from '../hooks/useMeData';
import Loading from './Loading';

const DisplayAvatar = ({width = 60, height = 60, className = "rounded-circle", altName = "Аватар"}) => {
    const { userMe, loading } = useMeData();
    const avatarUri = userMe?.avatar_uri ? userMe.avatar_uri : userMe?.avatar;

    if (loading) return <Loading />;

    return (
        <>
            {userMe?.avatar && (
                <div className="text-center">
                    <img src={avatarUri} alt={altName} className={className} width={width} height={height} />
                </div>
            )}
        </>
    )
};

export default DisplayAvatar;