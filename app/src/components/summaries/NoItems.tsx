import React from "react";

interface IItemsNotFound {
    error?: string
}

const NoItems: React.FC<IItemsNotFound> = () => {
    return (
        <p>NO ITEMS</p>
    )
}

export default NoItems