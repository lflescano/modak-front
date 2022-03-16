import React from "react";

import MainLayout from 'components/organisms/MainLayout';
import InfiniteScroll from 'components/molecules/InfiniteScroll';

import "./styles.scss";

const List = ({ elements, title, hasMore, fetchMoreData, showLinks }) => {
    return <MainLayout>
        <div className="community-list-header">
            <h1>{title}</h1>
        </div>
        {elements && <InfiniteScroll elements={elements} hasMore={hasMore} fetchMoreData={fetchMoreData} showLinks={showLinks}/>}
    </MainLayout>
}

export default List;





