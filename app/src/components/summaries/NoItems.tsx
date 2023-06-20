import React from "react";

interface IItemsNotFound {
    error?: string
}

const NoItems: React.FC<IItemsNotFound> = () => {
    // TODO: Add proper html
    return (
        <p className="m-auto text-center pt-12 text-2xl">NO ITEMS</p>
    )
}

export default NoItems