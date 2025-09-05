import { getUserDataFromToken } from '../utils/authUtils';
import apiClient from '../api/axiosConfig';
import { useEffect, useState } from 'react';
import DisplayAvatar from './DisplayAvatar';
import { useMeData } from '../hooks/useMeData';
import UserInfo from './UserInfo';
import LoadingLine from './LoadingLine';

const renderHeader = (isScrolled = false) => {
    const [clientTitle, setClientTitle] = useState('');
    const [employeeTitle, setEmployeeTitle] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isPaid, setIsPaid] = useState(false);
    const [dayOfPay, setDayOfPay] = useState(28);
    const [monthOfPay, setMonthOfPay] = useState(1);
    const userData = getUserDataFromToken();
    const classClientTitle = `header-line-client-title me-2 me-md-3 me-lg-5${isScrolled ? ' scrolled' : ''}`;
    const classClientLead = `header-line-client-lead${isScrolled ? ' scrolled' : ''}`;
    const classClientBlock = `d-flex align-items-center justify-content-between me-2 me-md-3 me-lg-5 header-line-client-block${isScrolled ? ' scrolled' : ''}`;
    const classClientIndicator = `header-line-client-indicator${isPaid ? ' paid' : ''}`;
    const monthMap = {
        1: "предыдущего",
        2: "текущего",
        3: "следующего"
    };
    const clientMonth = monthMap[monthOfPay] || "текущего";
    const [error, setError] = useState(null);
    const { userMe, loading } = useMeData();

    useEffect(() => {
        if (userData?.clientId) {
            apiClient.get(`/clients/${userData.clientId}`)
                .then(response => {
                    setClientTitle(response.data.title);
                    setIsPaid(response.data.isPaid);
                    setDayOfPay(response.data.dayOfPaiment);
                    setMonthOfPay(response.data.monthOfPaiment);
                })
                .catch(err => {
                    setError('Не удалось загрузить данные клиента. ' + err);
                    setClientTitle('Client');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else if (userData?.employeeId) {
            apiClient.get(`/employees/${userData.employeeId}`)
                .then(response => {
                    setEmployeeTitle(response.data.job_title);
                })
                .catch(err => {
                    setError('Не удалось загрузить данные developera. ' + err);
                    setEmployeeTitle('Developer');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, [userData]); // Зависимость от userData

    if (!userData || !userData.roles) {
        return null;
    }

    if (isLoading) {
        return <LoadingLine />;
    }

        // Если это СУПЕР-АДМИН
    if (userData.roles.includes('ROLE_SUPER_ADMIN')) {
        return (
            <>
                <UserInfo user={userMe} role={employeeTitle} />
                <DisplayAvatar width="60" height="60" className="rounded-circle" altName="Аватар" />
            </>
        );
    }

    // Если это СОТРУДНИК
    if (userData.roles.includes('ROLE_ADMIN')) {
        return (
            <>
                <UserInfo user={userMe} role={employeeTitle} />
                <DisplayAvatar width="60" height="60" className="rounded-circle" altName="Аватар" />
            </>
        );
    }
    
    // Если это КЛИЕНТ
    if (userData.clientId) {
        return (
            <>
                <div className={classClientBlock}>
                    <div className={classClientIndicator}></div>
                    <div className="header-line-client-info">
                        <p className={classClientLead}>
                            {isPaid && (
                                'Оплачено.'
                            )}
                            {!isPaid && (
                                'Платежная информация:'
                            )}
                        </p>
                        <p className="header-line-client-text">Оплата производится до {dayOfPay} числа {clientMonth} месяца</p>
                    </div>
                </div>
                <h2 className={classClientTitle}>{clientTitle}</h2>
                <DisplayAvatar width="60" height="60" className="rounded-circle" altName="Аватар" />
            </>
        );
    }

    return null;
};

export default renderHeader;