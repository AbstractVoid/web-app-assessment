import React from "react";

interface IItemsNotFound {
    error?: string
}

const NoItems: React.FC<IItemsNotFound> = () => {
    return (
        <p className="m-auto text-center pt-12 text-2xl">No items found.</p>
    )
}

export default NoItems