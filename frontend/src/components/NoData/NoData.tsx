type NoDataProps = {
    onRefresh: () => void;
};

export const NoData = ({ onRefresh }: NoDataProps) => {
    return (
        <div className="no-data">
            <p>Нет данных для отображения</p>
            <button className="button refresh-button" onClick={onRefresh}>
                Обновить
            </button>
        </div>
    );
};
